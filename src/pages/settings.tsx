import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Bell,
  Shield,
  Download,
  Trash2,
  Lock,
  LogOut,
  Save,
  AlertTriangle,
  Sun,
  Moon,
  Monitor,
  Palette,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/api/client';

export default function Settings() {
  const { user, logout, deleteAccount: performDelete } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [organization, setOrganization] = useState(
    user?.institution || (user as any)?.organization || ''
  );

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [researchUpdates, setResearchUpdates] = useState(true);
  const [profileVisible, setProfileVisible] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const saveProfile = async () => {
    try {
      await apiClient.put('/auth/profile', { name, institution: organization });
      alert('Profile updated successfully.');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  const downloadData = () => {
    const data = {
      profile: {
        name,
        email,
        organization,
        role: user?.role,
      },
      preferences: {
        theme,
        emailNotifications,
        researchUpdates,
        profileVisible,
      },
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'dhruv-account-data.json';
    link.click();

    URL.revokeObjectURL(url);
  };

  const deleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      return;
    }
    setIsDeleting(true);
    try {
      await performDelete();
      alert('Account has been permanently deleted.');
      setShowDeleteModal(false);
      navigate('/auth/login', { replace: true });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete account.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-ink px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="border-b border-line pb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-forest-700 bg-forest-50 px-2 py-0.5 rounded border border-forest-200">
            Account Management
          </span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-ink mt-1">Platform Settings</h1>
          <p className="text-xs text-ink-light mt-0.5">
            Manage your personal profile, visual theme, notification preferences, and account privacy.
          </p>
        </div>

        <div className="space-y-6">

          {/* Appearance / Theme Selector */}
          <section className="card-surface p-6">
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-line">
              <div className="p-1.5 rounded bg-surface-subtle text-forest-700 border border-line">
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-serif font-bold text-ink">
                  Appearance &amp; Theme
                </h2>
                <p className="text-xs text-ink-light">
                  Select your preferred scientific color theme. Persists across sessions.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Light Mode Option */}
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-4 rounded border text-left transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'border-forest-600 bg-forest-50/70 shadow-xs ring-1 ring-forest-600/30'
                    : 'border-line bg-surface-subtle hover:border-forest-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded bg-surface border border-line text-amber-600 dark:text-amber-400">
                    <Sun className="w-4 h-4" />
                  </div>
                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    theme === 'light' ? 'border-forest-600 bg-forest-600' : 'border-line'
                  }`}>
                    {theme === 'light' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                </div>
                <div className="font-semibold text-xs text-ink">Light Mode</div>
                <p className="text-[11px] text-ink-light mt-0.5">Warm ivory editorial archive</p>
              </button>

              {/* Dark Mode Option */}
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-4 rounded border text-left transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'border-forest-600 bg-forest-50/70 shadow-xs ring-1 ring-forest-600/30'
                    : 'border-line bg-surface-subtle hover:border-forest-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded bg-surface border border-line text-forest-600 dark:text-forest-400">
                    <Moon className="w-4 h-4" />
                  </div>
                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    theme === 'dark' ? 'border-forest-600 bg-forest-600' : 'border-line'
                  }`}>
                    {theme === 'dark' && <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-[#171614]" />}
                  </span>
                </div>
                <div className="font-semibold text-xs text-ink">Dark Mode</div>
                <p className="text-[11px] text-ink-light mt-0.5">Charcoal scientific archive</p>
              </button>

              {/* System Option */}
              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`p-4 rounded border text-left transition-all cursor-pointer ${
                  theme === 'system'
                    ? 'border-forest-600 bg-forest-50/70 shadow-xs ring-1 ring-forest-600/30'
                    : 'border-line bg-surface-subtle hover:border-forest-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded bg-surface border border-line text-ink-light">
                    <Monitor className="w-4 h-4" />
                  </div>
                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    theme === 'system' ? 'border-forest-600 bg-forest-600' : 'border-line'
                  }`}>
                    {theme === 'system' && <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-[#171614]" />}
                  </span>
                </div>
                <div className="font-semibold text-xs text-ink">System Default</div>
                <p className="text-[11px] text-ink-light mt-0.5">Matches operating system</p>
              </button>
            </div>
          </section>

          {/* Profile */}
          <section className="card-surface p-6">
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-line">
              <div className="p-1.5 rounded bg-surface-subtle text-forest-700 border border-line">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-serif font-bold text-ink">
                  Personal Information
                </h2>
                <p className="text-xs text-ink-light">
                  Update your contact details and institution affiliation.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  Full Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-surface-subtle border border-line text-ink text-xs outline-none focus:border-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  Institutional Email Address
                </label>
                <input
                  value={email}
                  disabled
                  className="w-full px-3 py-2 rounded bg-surface-subtle/40 border border-line/60 text-ink-muted text-xs cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  Organization / Research Centre
                </label>
                <input
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. NCPOR, Ministry of Earth Sciences"
                  className="w-full px-3 py-2 rounded bg-surface-subtle border border-line text-ink text-xs outline-none focus:border-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  Assigned Account Role
                </label>
                <div className="px-3 py-2 rounded bg-surface-subtle border border-line text-xs font-mono text-ink">
                  {user?.role || 'PUBLIC'}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-line flex justify-end">
              <button
                onClick={saveProfile}
                className="btn-primary text-xs flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                Save Profile Changes
              </button>
            </div>
          </section>

          {/* Notifications */}
          <section className="card-surface p-6">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-line">
              <div className="p-1.5 rounded bg-surface-subtle text-forest-700 border border-line">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-serif font-bold text-ink">
                  Notification Preferences
                </h2>
                <p className="text-xs text-ink-light">
                  Select communications dispatched to your email.
                </p>
              </div>
            </div>

            <SettingToggle
              title="Editorial Status Alerts"
              description="Receive email notifications when papers are verified or flagged for revision."
              enabled={emailNotifications}
              onChange={setEmailNotifications}
            />

            <SettingToggle
              title="Polar Science Bulletin"
              description="Receive summaries of new datasets and expedition reports."
              enabled={researchUpdates}
              onChange={setResearchUpdates}
            />
          </section>

          {/* Privacy & Data */}
          <section className="card-surface p-6">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-line">
              <div className="p-1.5 rounded bg-surface-subtle text-forest-700 border border-line">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-serif font-bold text-ink">
                  Privacy &amp; Data Export
                </h2>
                <p className="text-xs text-ink-light">
                  Manage directory visibility and download your account records.
                </p>
              </div>
            </div>

            <SettingToggle
              title="Public Researcher Directory Profile"
              description="Allow other scientists to view your publications in the researcher directory."
              enabled={profileVisible}
              onChange={setProfileVisible}
            />

            <div className="pt-4 flex items-center justify-between border-t border-line">
              <div>
                <p className="text-xs font-semibold text-ink">Export Archive Metadata</p>
                <p className="text-[11px] text-ink-light">Download a JSON record of your account preferences and activity.</p>
              </div>
              <button
                onClick={downloadData}
                className="btn-secondary text-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download JSON Data
              </button>
            </div>
          </section>

          {/* Security & Danger Zone */}
          <section className="card-surface p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-line">
              <div className="p-1.5 rounded bg-surface-subtle text-forest-700 border border-line">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-serif font-bold text-ink">
                  Authentication &amp; Account Status
                </h2>
                <p className="text-xs text-ink-light">
                  Manage session credentials or permanently delete account data.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={logout}
                className="btn-secondary text-xs flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-3 py-1.5 rounded bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Account
              </button>
            </div>
          </section>

        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-xs flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md card-surface p-6 shadow-modal space-y-4"
          >
            <div className="flex items-center gap-2.5 pb-3 border-b border-line text-red-700 dark:text-red-400">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h2 className="text-base font-serif font-bold text-ink">
                Permanently Delete Account?
              </h2>
            </div>

            <p className="text-xs text-ink-light leading-relaxed">
              This action cannot be reversed. Your account credentials and personal drafts will be removed from the database. Approved public scientific papers will remain cited in the public repository without private user data.
            </p>

            <div>
              <label className="text-xs font-semibold text-ink">
                Type <strong className="text-red-700 dark:text-red-400 font-mono">DELETE</strong> to confirm:
              </label>
              <input
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="DELETE"
                className="mt-1.5 w-full px-3 py-2 rounded bg-surface-subtle border border-line text-xs font-mono text-ink outline-none focus:border-red-600"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-line">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation('');
                }}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                disabled={deleteConfirmation !== 'DELETE' || isDeleting}
                onClick={deleteAccount}
                className="btn-primary bg-red-700 hover:bg-red-800 border-red-700 dark:bg-red-700 dark:text-white dark:hover:bg-red-800 text-xs disabled:opacity-40"
              >
                {isDeleting ? 'Deleting Account...' : 'Confirm Account Deletion'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}

function SettingToggle({
  title,
  description,
  enabled,
  onChange,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-line last:border-0">
      <div>
        <h3 className="text-xs font-semibold text-ink">
          {title}
        </h3>
        <p className="text-[11px] text-ink-light">
          {description}
        </p>
      </div>

      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
          enabled ? 'bg-forest-600' : 'bg-surface-subtle border border-line'
        }`}
        aria-label={title}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
            enabled ? 'left-5.5' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  );
}