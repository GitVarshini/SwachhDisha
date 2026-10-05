import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Camera,
  CheckCircle2,
  AlertCircle,
  Navigation,
  Upload,
  User,
  Shield,
  ArrowRight,
  FileCheck,
} from 'lucide-react';
import { WASTE_CATEGORIES, CITY_WARDS } from '../../utils/constants';
import { ReportSeverity, WasteReport } from '../../types';
import { reportApi } from '../../services/api/reportApi';

export const ReportWastePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialCategory = searchParams.get('category') || 'plastic';

  // Form State
  const [category, setCategory] = useState<string>(initialCategory);
  const [severity, setSeverity] = useState<ReportSeverity>('HIGH');
  const [description, setDescription] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [ward, setWard] = useState<string>(CITY_WARDS[0]);
  const [latitude, setLatitude] = useState<number>(17.385);
  const [longitude, setLongitude] = useState<number>(78.4867);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [reporterName, setReporterName] = useState<string>('Varshini A.');
  const [reporterContact, setReporterContact] = useState<string>('+91 94401 55667');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Submission & Feedback State
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedReport, setSubmittedReport] = useState<WasteReport | null>(null);

  // Geolocation Handler
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your current browser.');
      return;
    }

    setIsLocating(true);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(Number(position.coords.latitude.toFixed(6)));
        setLongitude(Number(position.coords.longitude.toFixed(6)));
        if (!address) {
          setAddress(`GPS Pin (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})`);
        }
        setIsLocating(false);
      },
      (error) => {
        console.warn('Geolocation failed or denied; using default civic coordinates', error);
        // Fallback to random coordinate offset in Hyderabad municipality
        const offsetLat = 17.385 + (Math.random() - 0.5) * 0.04;
        const offsetLng = 78.4867 + (Math.random() - 0.5) * 0.04;
        setLatitude(Number(offsetLat.toFixed(6)));
        setLongitude(Number(offsetLng.toFixed(6)));
        if (!address) {
          setAddress('Central Municipal Highway Junction');
        }
        setIsLocating(false);
      },
      { timeout: 7000 }
    );
  };

  // Mock Photo Upload Simulation
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!description.trim() || description.length < 15) {
      setErrorMessage('Please provide a descriptive explanation of the waste issue (minimum 15 characters).');
      return;
    }

    if (!address.trim()) {
      setErrorMessage('Please specify an address or landmark for the inspecting team.');
      return;
    }

    if (!isAnonymous && !reporterName.trim()) {
      setErrorMessage('Please provide your name or enable the "Report Anonymously" switch.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Structured payload matching MySQL ready contract
      const payload = {
        category,
        severity,
        description: description.trim(),
        address: address.trim(),
        ward,
        latitude,
        longitude,
        photoUrl: photoPreview || undefined,
        isAnonymous,
        reporterName: isAnonymous ? undefined : reporterName.trim(),
        reporterContact: isAnonymous ? undefined : reporterContact.trim(),
      };

      const result = await reportApi.create(payload);
      setSubmittedReport(result);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit waste report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setDescription('');
    setAddress('');
    setPhotoPreview(null);
    setSubmittedReport(null);
    setErrorMessage(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Page Header */}
      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
          Civic Grievance Desk
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-1">
          Report a Waste Problem
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
          Submit details and coordinates to alert municipal inspection squads and priority sanitation vehicles.
        </p>
      </div>

      {/* Success Confirmation Card View */}
      {submittedReport ? (
        <div className="bg-white border border-emerald-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                Submission Acknowledged
              </span>
              <h2 className="text-xl font-bold text-slate-900 font-display mt-0.5">
                Report Submitted Successfully
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Your report has entered the municipal triage queue. Inspecting officers in {submittedReport.ward} have been alerted.
              </p>
            </div>
          </div>

          {/* Submission Details Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 font-medium">Tracking Report ID</span>
              <p className="text-sm font-mono font-bold text-slate-900 mt-0.5">
                {submittedReport.id}
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Current Status</span>
              <p className="text-sm font-semibold text-amber-700 mt-0.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Pending Verification
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Category & Severity</span>
              <p className="text-xs font-semibold text-slate-800 capitalize mt-0.5">
                {submittedReport.category} Waste · {submittedReport.severity} Severity
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Date & Time Logged</span>
              <p className="text-xs text-slate-700 font-mono mt-0.5">
                {new Date(submittedReport.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="sm:col-span-2 pt-2 border-t border-slate-200">
              <span className="text-slate-400 font-medium">Location</span>
              <p className="text-xs font-medium text-slate-900 mt-0.5">{submittedReport.address}</p>
              <p className="text-[11px] text-slate-500 font-mono">
                {submittedReport.ward} · Lat: {submittedReport.latitude}, Lng: {submittedReport.longitude}
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/my-reports"
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <FileCheck className="w-4 h-4" />
              <span>Track in My Reports</span>
            </Link>
            <Link
              to="/map"
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>View On Live Map</span>
            </Link>
            <button
              onClick={handleResetForm}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors ml-auto"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      ) : (
        /* Report Form */
        <form onSubmit={handleSubmit} className="space-y-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <p>{errorMessage}</p>
            </div>
          )}

          {/* Section 1: Location & Coordinates */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-semibold text-slate-900 font-display flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>1. Incident Location</span>
              </h3>
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={isLocating}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors disabled:opacity-50"
              >
                <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'Fetching GPS...' : 'Use My Current Location'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Street Address or Landmark <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Near Pillar 142, Metro Junction Outer Ring Road"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Municipal Ward / Zone <span className="text-rose-500">*</span>
                </label>
                <select
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {CITY_WARDS.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={latitude}
                    onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={longitude}
                    onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Waste Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 font-display flex items-center gap-2 border-b border-slate-100 pb-2">
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>2. Waste Details & Severity</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Waste Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 capitalize"
                >
                  {WASTE_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Assessed Severity Level <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as ReportSeverity[]).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSeverity(level)}
                      className={`py-1.5 text-xs font-medium rounded-md border transition-colors ${
                        severity === level
                          ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Problem Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the accumulation, duration, odor, road blockage, or specific risks..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                />
                <p className="text-[11px] text-slate-400">
                  {description.length}/500 characters (minimum 15 characters)
                </p>
              </div>

              {/* Photo Upload (Optional) */}
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Optional Photographic Evidence
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 rounded-lg text-xs font-medium text-slate-700 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-slate-500" />
                    <span>Upload Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                  {photoPreview && (
                    <div className="flex items-center gap-2">
                      <img
                        src={photoPreview}
                        alt="Evidence preview"
                        className="w-10 h-10 object-cover rounded-md border border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => setPhotoPreview(null)}
                        className="text-[11px] text-rose-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Reporter Details & Anonymous Switch */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-semibold text-slate-900 font-display flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600" />
                <span>3. Reporter Identification</span>
              </h3>

              {/* Anonymous Toggle */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <span className="text-xs font-medium text-slate-700">Report Anonymously</span>
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 border-slate-300"
                />
              </label>
            </div>

            {isAnonymous ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-amber-600 shrink-0" />
                <p>
                  Anonymous Mode Active: Your name and contact will be omitted from municipal records. You will still receive an issue tracking ID.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">Your Full Name</label>
                  <input
                    type="text"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">Contact Number</label>
                  <input
                    type="text"
                    value={reporterContact}
                    onChange={(e) => setReporterContact(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Link
              to="/"
              className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              Cancel and Return
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting to Dispatch...</span>
                </>
              ) : (
                <>
                  <span>Submit Waste Issue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
