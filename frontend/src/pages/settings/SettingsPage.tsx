import React, { useState, useEffect } from 'react';
import { Bell, Palette, Save, RefreshCw } from 'lucide-react';
import { settingsAPI } from '../../services/api'

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      assignmentReminders: true,
      quizReminders: true,
      courseUpdates: true,
      messages: true,
    },
    preferences: {
      theme: 'auto',
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
    },
  });
  const [timezones, setTimezones] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Fetch settings, timezones, and languages on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [settingsRes, timezonesRes, languagesRes] = await Promise.all([
          settingsAPI.getSettings(),
          settingsAPI.getTimezones(),
          settingsAPI.getLanguages(),
        ]);

        // Map backend settings to frontend state
        setSettings({
          notifications: {
            email: settingsRes.email_notifications,
            push: settingsRes.push_notifications,
            sms: settingsRes.sms_notifications,
            assignmentReminders: settingsRes.preferences?.assignmentReminders ?? true,
            quizReminders: settingsRes.preferences?.quizReminders ?? true,
            courseUpdates: settingsRes.preferences?.courseUpdates ?? true,
            messages: settingsRes.preferences?.messages ?? true,
          },
          preferences: {
            theme: settingsRes.dark_mode ? 'dark' : 'auto',
            language: settingsRes.language,
            timezone: settingsRes.timezone,
            dateFormat: settingsRes.preferences?.dateFormat ?? 'MM/DD/YYYY',
            timeFormat: settingsRes.preferences?.timeFormat ?? '12h',
          },
        });
        setTimezones(timezonesRes);
        setLanguages(languagesRes);
        setMessage({ type: 'success', text: 'Settings loaded successfully' });
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to load settings' });
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle input changes
  const handleInputChange = (section, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Save settings
  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const settingsData = {
        email_notifications: settings.notifications.email,
        push_notifications: settings.notifications.push,
        sms_notifications: settings.notifications.sms,
        timezone: settings.preferences.timezone,
        language: settings.preferences.language,
        dark_mode: settings.preferences.theme === 'dark',
        preferences: {
          assignmentReminders: settings.notifications.assignmentReminders,
          quizReminders: settings.notifications.quizReminders,
          courseUpdates: settings.notifications.courseUpdates,
          messages: settings.notifications.messages,
          dateFormat: settings.preferences.dateFormat,
          timeFormat: settings.preferences.timeFormat,
        },
      };
      const updatedSettings = await settingsAPI.updateSettings(settingsData);
      setSettings({
        notifications: {
          email: updatedSettings.email_notifications,
          push: updatedSettings.push_notifications,
          sms: updatedSettings.sms_notifications,
          assignmentReminders: updatedSettings.preferences?.assignmentReminders ?? true,
          quizReminders: updatedSettings.preferences?.quizReminders ?? true,
          courseUpdates: updatedSettings.preferences?.courseUpdates ?? true,
          messages: updatedSettings.preferences?.messages ?? true,
        },
        preferences: {
          theme: updatedSettings.dark_mode ? 'dark' : 'auto',
          language: updatedSettings.language,
          timezone: updatedSettings.timezone,
          dateFormat: updatedSettings.preferences?.dateFormat ?? 'MM/DD/YYYY',
          timeFormat: updatedSettings.preferences?.timeFormat ?? '12h',
        },
      });
      setMessage({ type: 'success', text: 'Settings saved successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Reset settings
  const handleReset = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const resetSettings = await settingsAPI.resetSettings();
      setSettings({
        notifications: {
          email: resetSettings.email_notifications,
          push: resetSettings.push_notifications,
          sms: resetSettings.sms_notifications,
          assignmentReminders: resetSettings.preferences?.assignmentReminders ?? true,
          quizReminders: resetSettings.preferences?.quizReminders ?? true,
          courseUpdates: resetSettings.preferences?.courseUpdates ?? true,
          messages: resetSettings.preferences?.messages ?? true,
        },
        preferences: {
          theme: resetSettings.dark_mode ? 'dark' : 'auto',
          language: resetSettings.language,
          timezone: resetSettings.timezone,
          dateFormat: resetSettings.preferences?.dateFormat ?? 'MM/DD/YYYY',
          timeFormat: resetSettings.preferences?.timeFormat ?? '12h',
        },
      });
      setMessage({ type: 'success', text: 'Settings reset to defaults' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to reset settings' });
      console.error('Error resetting settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h1 className="h3 mb-2 text-dark">Settings</h1>
        <p className="text-muted">Manage your notifications and preferences</p>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} mb-4`} role="alert">
          {message.text}
        </div>
      )}

      {/* Notifications Section */}
      <div className="mb-5">
        <h4 className="mb-3 d-flex align-items-center gap-2">
          <Bell size={20} /> Notifications
        </h4>
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0">Notification Channels</h5>
          </div>
          <div className="card-body">
            {[
              { key: 'email', label: 'Email Notifications', desc: 'Receive notifications via email' },
              { key: 'push', label: 'Push Notifications', desc: 'Receive push notifications in your browser' },
              { key: 'sms', label: 'SMS Notifications', desc: 'Receive notifications via text message' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="d-flex align-items-center justify-content-between mb-3">
                <div>
                  <h6 className="mb-1 text-dark">{label}</h6>
                  <p className="small text-muted mb-0">{desc}</p>
                </div>
                <div className="form-check form-switch">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={settings.notifications[key]}
                    onChange={(e) => handleInputChange('notifications', key, e.target.checked)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0">Notification Types</h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              {[
                { key: 'assignmentReminders', label: 'Assignment Reminders', desc: 'Get reminded about upcoming assignments' },
                { key: 'quizReminders', label: 'Quiz Reminders', desc: 'Get reminded about upcoming quizzes' },
                { key: 'courseUpdates', label: 'Course Updates', desc: 'Receive updates about your courses' },
                { key: 'messages', label: 'New Messages', desc: 'Get notified about new messages' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="col-md-6 d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="mb-1 text-dark">{label}</h6>
                    <p className="small text-muted mb-0">{desc}</p>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={settings.notifications[key]}
                      onChange={(e) => handleInputChange('notifications', key, e.target.checked)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="mb-5">
        <h4 className="mb-3 d-flex align-items-center gap-2">
          <Palette size={20} /> Preferences
        </h4>
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small text-dark">Theme</label>
                <select
                  value={settings.preferences.theme}
                  onChange={(e) => handleInputChange('preferences', 'theme', e.target.value)}
                  className="form-select"
                >
                  <option value="auto">Auto (System)</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label small text-dark">Language</label>
                <select
                  value={settings.preferences.language}
                  onChange={(e) => handleInputChange('preferences', 'language', e.target.value)}
                  className="form-select"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label small text-dark">Timezone</label>
                <select
                  value={settings.preferences.timezone}
                  onChange={(e) => handleInputChange('preferences', 'timezone', e.target.value)}
                  className="form-select"
                >
                  {timezones.map((tz) => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label small text-dark">Time Format</label>
                <select
                  value={settings.preferences.timeFormat}
                  onChange={(e) => handleInputChange('preferences', 'timeFormat', e.target.value)}
                  className="form-select"
                >
                  <option value="12h">12-hour (AM/PM)</option>
                  <option value="24h">24-hour</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label small text-dark">Date Format</label>
                <select
                  value={settings.preferences.dateFormat}
                  onChange={(e) => handleInputChange('preferences', 'dateFormat', e.target.value)}
                  className="form-select"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save and Reset Buttons */}
      <div className="d-flex gap-3">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn btn-primary d-flex align-items-center gap-2"
        >
          <Save size={16} />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          onClick={handleReset}
          disabled={isSaving}
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
        >
          <RefreshCw size={16} />
          Reset to Defaults
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;