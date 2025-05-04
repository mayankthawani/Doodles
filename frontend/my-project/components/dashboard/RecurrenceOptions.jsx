"use client";

import { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox"; 
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const weekdays = [
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
  { label: 'Sun', value: 0 },
];

const nthOptions = [
  { label: 'First', value: 1 },
  { label: 'Second', value: 2 },
  { label: 'Third', value: 3 },
  { label: 'Fourth', value: 4 },
  { label: 'Last', value: -1 },
];

export default function RecurrenceOptions({ value, onChange }) {
  // Update the initial state to include endDate
  const [customSettings, setCustomSettings] = useState({
    interval: 1,
    unit: 'days',
    weekdays: [],
    nthDay: null,
    startDate: new Date(),
    endDate: null
  });

  const [localSettings, setLocalSettings] = useState(value.customSettings || {
    interval: 1,
    unit: 'days',
  });

  // Add validation when saving custom settings
  const validateCustomSettings = (settings) => {
    if (!settings.startDate) {
      throw new Error('Start date is required for recurring tasks');
    }

    if (settings.endDate && new Date(settings.endDate) < new Date(settings.startDate)) {
      throw new Error('End date cannot be before start date');
    }

    return settings;
  };

  // Update the effect to validate settings
  useEffect(() => {
    if (value.frequency === 'custom') {
      try {
        const validatedSettings = validateCustomSettings(customSettings);
        onChange({
          ...value,
          customSettings: validatedSettings
        });
      } catch (err) {
        console.error('Invalid recurrence settings:', err);
      }
    }
  }, [customSettings]);

  const updateLocalSettings = (update) => {
    const newSettings = { ...localSettings, ...update };
    setLocalSettings(newSettings);
    if (value.frequency === 'custom') {
      onChange({ frequency: 'custom', customSettings: newSettings });
    }
  };

  const updateCustomSetting = (key, val) => {
    const newSettings = {
      ...customSettings,
      [key]: val
    };
    setCustomSettings(newSettings);
    
    // Immediately notify parent of changes
    if (value.frequency === 'custom') {
      onChange({
        frequency: 'custom',
        customSettings: newSettings
      });
    }
  };

  return (
    <div className="space-y-4">
      <RadioGroup
        value={value.frequency}
        onValueChange={(freq) => onChange({ 
          frequency: freq,
          customSettings: freq === 'custom' ? localSettings : null 
        })}
      >
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex items-center">
            <RadioGroupItem value="none" id="none" />
            <Label htmlFor="none" className="ml-2">No recurrence</Label>
          </div>
          <div className="flex items-center">
            <RadioGroupItem value="daily" id="daily" />
            <Label htmlFor="daily" className="ml-2">Daily</Label>
          </div>
          <div className="flex items-center">
            <RadioGroupItem value="weekly" id="weekly" />
            <Label htmlFor="weekly" className="ml-2">Weekly</Label>
          </div>
          <div className="flex items-center">
            <RadioGroupItem value="monthly" id="monthly" />
            <Label htmlFor="monthly" className="ml-2">Monthly</Label>
          </div>
          <div className="flex items-center">
            <RadioGroupItem value="custom" id="custom" />
            <Label htmlFor="custom" className="ml-2">Custom</Label>
          </div>
        </div>
      </RadioGroup>

      {value.frequency === 'custom' && (
        <div className="p-4 bg-slate-800/50 rounded-lg space-y-4">
          <div className="flex items-center gap-4">
            <Label>Every</Label>
            <Input 
              type="number"
              min="1"
              value={localSettings.interval}
              onChange={(e) => updateLocalSettings({ interval: parseInt(e.target.value) })}
              className="w-20"
            />
            <Select
              value={localSettings.unit}
              onValueChange={(unit) => updateLocalSettings({ unit })}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="days">Days</SelectItem>
                <SelectItem value="weeks">Weeks</SelectItem>
                <SelectItem value="months">Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
