import './App.css'
import React, { useState, useEffect } from 'react';
import { Upload, FileText, Mail, Download, CheckSquare, Square, Users, File } from 'lucide-react';


export default function UserDocumentManagement() {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [pdfFiles, setPdfFiles] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Load sample data
  useEffect(() => {
    const sampleUsers = [
      { id: 1, name: 'ankit', email: 'ankit@example.com', message: 'Need project documents' },
      { id: 2, name: 'ramesh', email: 'ramesh@example.com', message: 'Request for proposal' },
      { id: 3, name: 'loki', email: 'loki@example.com', message: 'Contract review needed' }
    ];
    setUsers(sampleUsers);

    const samplePdfs = [
      { id: 1, name: 'Project_Proposal.pdf', path: '/docs/proposal.pdf' },
      { id: 2, name: 'Contract_Template.pdf', path: '/docs/contract.pdf' },
      { id: 3, name: 'User_Manual.pdf', path: '/docs/manual.pdf' }
    ];
    setPdfFiles(samplePdfs);
  }, []);

  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n');
      const newUsers = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const [name, email, message] = line.split(',').map(s => s.trim());
        if (name && email) {
          newUsers.push({
            id: users.length + i,
            name,
            email,
            message: message || ''
          });
        }
      }

      setUsers([...users, ...newUsers]);
      setMessage(`Successfully uploaded ${newUsers.length} users`);
      setTimeout(() => setMessage(''), 3000);
    };

    reader.readAsText(file);
    e.target.value = '';
  };

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const newPdf = {
      id: pdfFiles.length + 1,
      name: file.name,
      path: `/uploads/${file.name}`,
      file: file
    };

    setPdfFiles([...pdfFiles, newPdf]);
    setMessage(`PDF "${file.name}" uploaded successfully`);
    setTimeout(() => setMessage(''), 3000);
    e.target.value = '';
  };

  const toggleUserSelection = (userId) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(users.map(u => u.id)));
    }
  };

  const handleAssignAndSend = async () => {
    if (selectedUsers.size === 0) {
      setMessage('Please select at least one user');
      return;
    }
    if (!selectedPdf) {
      setMessage('Please select a PDF to assign');
      return;
    }

    setLoading(true);
    const selectedUsersList = users.filter(u => selectedUsers.has(u.id));

    // Simulate API call
    setTimeout(() => {
      setMessage(`PDF assigned and email sent to ${selectedUsersList.length} user(s)`);
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }, 1500);
  };

  const handleDownloadZip = () => {
    if (selectedUsers.size === 0) {
      setMessage('Please select at least one user to download documents');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setMessage('ZIP file downloaded successfully');
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }, 1000);
  };

  return (
    <div className="app-container">
      <div className="main-wrapper">
        <div className="content-card">
          
          {/* Header */}
          <div className="header">
            <div className="header-title">
              <Users size={40} color="#667eea" />
              <h1>User Document Management</h1>
            </div>
            <p className="header-subtitle">Upload, manage, and distribute documents to users</p>
          </div>

          {/* Message Alert */}
          {message && (
            <div className="alert-message">
              {message}
            </div>
          )}

          {/* Upload Section */}
          <div className="upload-grid">
            <div className="upload-box">
              <Upload size={32} color="#667eea" className="upload-icon" />
              <h3>Upload CSV</h3>
              <p className="upload-description">name, email, message</p>
              <label className="upload-label upload-label-csv">
                Choose CSV File
                <input type="file" accept=".csv" onChange={handleCsvUpload} className="file-input" />
              </label>
            </div>

            <div className="upload-box">
              <FileText size={32} color="#764ba2" className="upload-icon" />
              <h3>Upload PDF</h3>
              <p className="upload-description">Document to distribute</p>
              <label className="upload-label upload-label-pdf">
                Choose PDF File
                <input type="file" accept=".pdf" onChange={handlePdfUpload} className="file-input" />
              </label>
            </div>
          </div>

          {/* PDF Selection */}
          {pdfFiles.length > 0 && (
            <div className="pdf-selection">
              <label className="pdf-label">Select PDF to Assign</label>
              <select 
                value={selectedPdf}
                onChange={(e) => setSelectedPdf(e.target.value)}
                className="pdf-select"
              >
                <option value="">-- Choose PDF --</option>
                {pdfFiles.map(pdf => (
                  <option key={pdf.id} value={pdf.id}>{pdf.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Users Table */}
          {users.length > 0 && (
            <div className="users-section">
              <div className="users-header">
                <h2>Users ({users.length})</h2>
                <span className="selected-count">{selectedUsers.size} selected</span>
              </div>
              
              <div className="table-wrapper">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>
                        <div 
                          onClick={toggleSelectAll}
                          className="select-all"
                        >
                          {selectedUsers.size === users.length ? 
                            <CheckSquare size={20} color="#667eea" /> : 
                            <Square size={20} color="#cbd5e0" />
                          }
                          <span>Select All</span>
                        </div>
                      </th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, idx) => (
                      <tr 
                        key={user.id}
                        className={`user-row ${selectedUsers.has(user.id) ? 'selected' : ''} ${idx % 2 === 0 ? 'even' : 'odd'}`}
                      >
                        <td>
                          <div 
                            onClick={() => toggleUserSelection(user.id)}
                            className="checkbox-cell"
                          >
                            {selectedUsers.has(user.id) ? 
                              <CheckSquare size={20} color="#667eea" /> : 
                              <Square size={20} color="#cbd5e0" />
                            }
                          </div>
                        </td>
                        <td className="user-name">{user.name}</td>
                        <td className="user-email">{user.email}</td>
                        <td className="user-message">{user.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {users.length > 0 && (
            <div className="action-buttons">
              <button
                onClick={handleAssignAndSend}
                disabled={loading || selectedUsers.size === 0 || !selectedPdf}
                className="btn btn-primary"
              >
                <Mail size={20} />
                Assign PDF & Send Email
              </button>

              <button
                onClick={handleDownloadZip}
                disabled={loading || selectedUsers.size === 0}
                className="btn btn-secondary"
              >
                <Download size={20} />
                Download ZIP
              </button>
            </div>
          )}

          {/* Empty State */}
          {users.length === 0 && (
            <div className="empty-state">
              <File size={64} color="#cbd5e0" className="empty-icon" />
              <p className="empty-title">No users yet</p>
              <p className="empty-subtitle">Upload a CSV file to get started</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="footer">
          <p>User Document Management System • Frontend Demo</p>
        </div>
      </div>
    </div>
  );
}