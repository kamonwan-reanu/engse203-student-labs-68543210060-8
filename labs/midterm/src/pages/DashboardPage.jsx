import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ErrorState from '../components/ErrorState.jsx';
import FilterBar from '../components/FilterBar.jsx';
import LoadingState from '../components/LoadingState.jsx';
import RequestList from '../components/RequestList.jsx';
import SummaryPanel from '../components/SummaryPanel.jsx';
import useManualReload from '../hooks/useManualReload.js';
// B3.2: เพิ่ม updateRequestStatus เข้ามาใน import
import { deleteRequest, getRequests, resetRequests, updateRequestStatus } from '../services/requestService.js';

function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const scenario = searchParams.get('scenario') ?? '';
  const [reloadKey, reload] = useManualReload();
  const [loadState, setLoadState] = useState('idle');
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');

  // TODO B2 / CP-B2.1: เพิ่ม state สำหรับข้อความค้นหา ที่นี่
  const [searchQuery, setSearchQuery] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let ignore = false;
    setLoadState('loading');
    setErrorMessage('');
    setNotice('');

    getRequests({
      scenario,
      onRecovery: (message) => { if (!ignore) setNotice(message); },
    }).then((data) => {
      if (ignore) return;
      setRequests(data);
      setLoadState('success');
    }).catch((error) => {
      if (ignore) return;
      setErrorMessage(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ');
      setLoadState('error');
    });

    return () => { ignore = true; };
  }, [scenario, reloadKey]);

  // FIX บั๊ก 2: เปลี่ยน status === 'completed' เป็น 'pending' และใช้ toLowerCase()
  // CP-B2.4: แผงสรุปคำนวณจาก requests ทั้งหมดเสมอ (ไม่เปลี่ยนตามการค้นหา)
  const summary = useMemo(() => ({
    total: requests.length,
    pending: requests.filter((request) => request.status?.toLowerCase() === 'pending').length,
    inProgress: requests.filter((request) => request.status?.toLowerCase() === 'in-progress').length,
    completed: requests.filter((request) => request.status?.toLowerCase() === 'completed').length,
  }), [requests]);

  // FIX บั๊ก 3: เปลี่ยนจาก !== เป็น === เพื่อให้กรองรายการที่ตรงกับ statusFilter
  // CP-B2.2 & CP-B2.3: กรองข้อมูลทั้งตามสถานะ และ ข้อความค้นหา (requesterName หรือ details)
  const filteredRequests = requests.filter((request) => {
    const matchesStatus = statusFilter === 'all' || request.status?.toLowerCase() === statusFilter.toLowerCase();
    
    const query = searchQuery.toLowerCase();
    const matchesSearch = (request.requesterName?.toLowerCase().includes(query) ?? false) ||
                          (request.details?.toLowerCase().includes(query) ?? false);

    return matchesStatus && matchesSearch;
  });

  function handleRetry() {
    if (scenario) setSearchParams({});
    else reload();
  }

  // FIX บั๊ก 5: เปลี่ยน setRequests(requests) เป็น setRequests(nextRequests) เพื่อให้ UI อัปเดตหลังลบ
  async function handleDelete(requestId) {
    try {
      const nextRequests = await deleteRequest(requestId);
      setRequests(nextRequests);
      setNotice(`ลบคำร้อง ${requestId} แล้ว`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'ลบคำร้องไม่สำเร็จ');
    }
  }

  // CP-B3.2 & CP-B3.3: อัปเดตสถานะคำร้องเป็น 'completed' บันทึกลง service/localStorage และอัปเดต state หน้าจอ
  async function handleMarkDone(requestId) {
    try {
      const nextRequests = await updateRequestStatus(requestId, 'completed');
      setRequests(nextRequests);
      setNotice(`อัปเดตคำร้อง ${requestId} เป็นเสร็จสิ้นแล้ว`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'อัปเดตสถานะไม่สำเร็จ');
    }
  }

  // FIX บั๊ก 6: เติม await หน้า resetRequests() เพราะมันคืนค่าเป็น Promise
  async function handleReset() {
    if (!window.confirm('ต้องการคืนข้อมูลตัวอย่างเริ่มต้นหรือไม่?')) return;
    try {
      const resetData = await resetRequests();
      setRequests(resetData);
      setStatusFilter('all');
      setSearchQuery('');
      setNotice('คืนข้อมูลตัวอย่างเริ่มต้นแล้ว');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'คืนข้อมูลไม่สำเร็จ');
    }
  }

  return (
    <section data-testid="page-dashboard">
      <div className="page-heading">
        <div><p className="eyebrow dark">ROUTED + PERSISTENT</p><h1>Dashboard</h1><p>ติดตามคำร้องจาก URL, Service Layer และ browser storage</p></div>
        <button className="button secondary" data-testid="reset-button" type="button" onClick={handleReset}>Reset Demo Data</button>
      </div>
      {scenario && <p className="lab-scenario" role="status">LAB test scenario: {scenario}</p>}
      {notice && <p className="notice" role="status">{notice}</p>}
      {loadState === 'loading' && <LoadingState />}
      {loadState === 'error' && <ErrorState message={errorMessage} onRetry={handleRetry} />}
      {loadState === 'success' && requests.length === 0 && (
        <section className="state-card" data-testid="empty-state">
          <h2>ยังไม่มีคำร้อง</h2><p>เริ่มสร้างคำร้องแรกของคุณได้เลย</p><Link className="button primary inline" to="/requests/new">สร้างคำร้องใหม่</Link>
        </section>
      )}
      {loadState === 'success' && requests.length > 0 && (
        <>
          <SummaryPanel summary={summary} />
          <section className="panel" aria-labelledby="request-list-title">
            <div className="section-heading"><h2 id="request-list-title">รายการคำร้อง</h2><FilterBar value={statusFilter} onFilterChange={setStatusFilter} /></div>
            
            {/* TODO B2 / CP-B2.1: วางช่อง <input> ค้นหา ตรงนี้ (เหนือรายการ) แล้วกรองร่วมกับตัวกรองสถานะ */}
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="ค้นหาจากผู้แจ้งหรือรายละเอียด"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input"
                data-testid="search-input"
              />
            </div>

            {/* CP-B2.4: หากค้นหาแล้วไม่เจอ ให้แสดงข้อความแจ้งเตือน */}
            {filteredRequests.length === 0 ? (
              <p className="subtle-empty" data-testid="search-empty-message">ไม่พบคำร้องที่ตรงกับการค้นหา</p>
            ) : (
              /* CP-B3.2: ส่ง onMarkDone={handleMarkDone} ไปยัง RequestList */
              <RequestList requests={filteredRequests} onDeleteRequest={handleDelete} onMarkDone={handleMarkDone} />
            )}
          </section>
        </>
      )}
    </section>
  );
}

export default DashboardPage;