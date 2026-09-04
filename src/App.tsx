import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { PatientQueue } from '@/components/PatientQueue';
import { ClinicalWorkspace } from '@/components/ClinicalWorkspace';
import { SceneIntelligence } from '@/components/SceneIntelligence';
import { ResourceAllocation } from '@/components/ResourceAllocation';
import { OrderHub, type DepartmentState, type DispatchResult } from '@/components/OrderHub';
import { IncomingReports } from '@/components/IncomingReports';
import { FacilityAllocation, type FacilityState } from '@/components/FacilityAllocation';
import { ActivityLog } from '@/components/ActivityLog';
import { Footer } from '@/components/Footer';
import {
  PATIENTS,
  INITIAL_RESOURCES,
  INITIAL_FACILITIES,
  INITIAL_ACTIVITY,
  type TriageLevel,
  type ResourceItem,
  type ResourceState,
  type ActivityEntry,
} from '@/data/mockData';

function App() {
  const [triageFilter, setTriageFilter] = useState<TriageLevel | 'ALL'>('ALL');
  const [selectedId, setSelectedId] = useState('AP-8842');
  const [resources, setResources] = useState<ResourceItem[]>(INITIAL_RESOURCES);
  const [facilities, setFacilities] = useState<FacilityState[]>(INITIAL_FACILITIES);
  const [activity, setActivity] = useState<ActivityEntry[]>(INITIAL_ACTIVITY);

  const [deptState, setDeptState] = useState<DepartmentState>({
    pharmacy: { actions: ['STAT Medication Request', 'Prepare Intubation Kit', 'Request Inotropic Support'], sent: false },
    radiology: { actions: ['STAT Chest X-Ray', 'Emergency CT', 'MRI'], sent: false },
    lab: { actions: ['Blood Panel', 'Crossmatch', 'Urine Analysis'], sent: false },
  });

  const [dispatch, setDispatch] = useState<DispatchResult>({
    show: false,
    pharmacy: false,
    radiology: false,
    lab: false,
  });

  const selectedPatient = PATIENTS.find((p) => p.id === selectedId) || PATIENTS[0];

  const addActivity = useCallback((text: string, level: ActivityEntry['level'] = 'info') => {
    const now = new Date();
    const h = (now.getHours() % 12 || 12).toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    setActivity((prev) => [{ time: `${h}:${m} ${ampm}`, text, level }, ...prev]);
  }, []);

  const handleSelectPatient = (id: string) => {
    setSelectedId(id);
    addActivity(`Doctor opened Patient #${id}.`, 'info');
  };

  const advanceResource = (id: string) => {
    setResources((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const next: ResourceState = r.state === 'READY' ? 'REQUESTED' : r.state === 'REQUESTED' ? 'CONFIRMED' : 'CONFIRMED';
        if (next !== r.state) {
          addActivity(`${r.label}: ${r.action} — ${next}.`, next === 'CONFIRMED' ? 'success' : 'info');
        }
        return { ...r, state: next };
      }),
    );
  };

  const toggleDeptAction = (dept: 'pharmacy' | 'radiology' | 'lab', action: string) => {
    setDeptState((prev) => {
      const d = prev[dept];
      const exists = d.actions.includes(action);
      const newActions = exists
        ? d.actions.map((a) => (a === action ? `✓ ${a.replace('✓ ', '')}` : a))
        : d.actions.map((a) => (a.replace('✓ ', '') === action ? action : a));
      return { ...prev, [dept]: { ...d, actions: newActions } };
    });
  };

  const sendToDept = (dept: 'pharmacy' | 'radiology' | 'lab') => {
    setDeptState((prev) => ({ ...prev, [dept]: { ...prev[dept], sent: true } }));
    const label = dept === 'lab' ? 'Laboratory' : dept.charAt(0).toUpperCase() + dept.slice(1);
    addActivity(`Order sent to ${label} Node.`, 'info');
  };

  const dispatchAll = () => {
    setDeptState((prev) => ({
      pharmacy: { ...prev.pharmacy, sent: true },
      radiology: { ...prev.radiology, sent: true },
      lab: { ...prev.lab, sent: true },
    }));
    setDispatch({ show: true, pharmacy: false, radiology: false, lab: false });
    addActivity('Dispatching all directives through Hospital LAN...', 'warn');

    setTimeout(() => setDispatch((prev) => ({ ...prev, pharmacy: true })), 800);
    setTimeout(() => setDispatch((prev) => ({ ...prev, radiology: true })), 1400);
    setTimeout(() => {
      setDispatch((prev) => ({ ...prev, lab: true }));
      addActivity('All directives received by department nodes.', 'success');
    }, 2000);
  };

  const assignFacility = (id: string) => {
    setFacilities((prev) =>
      prev.map((f) => {
        if (f.id !== id || f.assigned || f.available === 0) return f;
        addActivity(`${f.label} — assigned.`, 'success');
        return { ...f, assigned: true, available: f.available - 1 };
      }),
    );
  };

  return (
    <div className="min-h-screen bg-base-950 bg-grid flex flex-col">
      <Header triageFilter={triageFilter} onTriageChange={setTriageFilter} />

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <PatientQueue
          patients={PATIENTS}
          selectedId={selectedId}
          onSelect={handleSelectPatient}
          triageFilter={triageFilter}
        />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto scroll-thin p-4 space-y-4">
          <ClinicalWorkspace patient={selectedPatient} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <ResourceAllocation resources={resources} onAdvance={advanceResource} />
            </div>
            <div>
              <SceneIntelligence patient={selectedPatient} />
            </div>
          </div>

          <OrderHub
            state={deptState}
            dispatch={dispatch}
            onToggleAction={toggleDeptAction}
            onSend={sendToDept}
            onDispatchAll={dispatchAll}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <IncomingReports />
            </div>
            <div className="space-y-4">
              <FacilityAllocation facilities={facilities} onAssign={assignFacility} />
              <ActivityLog entries={activity} />
            </div>
          </div>
        </main>
      </div>

      <Footer onDispatchAll={dispatchAll} />
    </div>
  );
}

export default App;
