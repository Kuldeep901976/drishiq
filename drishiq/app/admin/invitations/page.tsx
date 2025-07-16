'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

interface Invitation {
  id: string;
  name: string;
  email: string;
  phone?: string;
  language: string;
  location?: string;
  challenge?: string;
  status: string;
  created_at: string;
  token?: string;
  expires_at?: string;
  invitation_type?: string;
}

export default function AdminInvitationsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvitations, setSelectedInvitations] = useState<string[]>([]);
  const [action, setAction] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      if (!supabase) {
        console.error('Supabase client not available');
        return;
      }

      const { data, error } = await supabase
        .from('Invitations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvitations(data || []);
    } catch (error) {
      console.error('Error fetching invitations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAction = async () => {
    if (!action || selectedInvitations.length === 0) return;

    try {
      const response = await fetch('/api/admin/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: action === 'bulk_approve' ? 'bulk_approve' : 
                  action === 'send_magic_link' ? 'send_magic_link' : 'discard',
          requestIds: selectedInvitations
        })
      });

      if (response.ok) {
        setSelectedInvitations([]);
        setAction('');
        fetchInvitations();
      }
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const filteredInvitations = invitations.filter(invitation => {
    const matchesSearch = invitation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invitation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (invitation.challenge && invitation.challenge.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || invitation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="p-6">Loading invitations...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Invitation Management</h1>
      
      {/* Search and Filters */}
      <div className="mb-6 flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by name, email, or challenge..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-lg flex-1 min-w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="used">Used</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selectedInvitations.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-4">
            <span>{selectedInvitations.length} invitation(s) selected</span>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="px-3 py-1 border rounded"
            >
              <option value="">Select action...</option>
              <option value="bulk_approve">Approve Selected</option>
              <option value="send_magic_link">Send Magic Link</option>
              <option value="discard">Discard Selected</option>
            </select>
            <button
              onClick={handleBulkAction}
              disabled={!action}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Apply
            </button>
            <button
              onClick={() => setSelectedInvitations([])}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Invitations Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedInvitations(filteredInvitations.map(i => i.id));
                    } else {
                      setSelectedInvitations([]);
                    }
                  }}
                  checked={selectedInvitations.length === filteredInvitations.length && filteredInvitations.length > 0}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Challenge
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInvitations.map((invitation) => (
              <tr key={invitation.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedInvitations.includes(invitation.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedInvitations([...selectedInvitations, invitation.id]);
                      } else {
                        setSelectedInvitations(selectedInvitations.filter(id => id !== invitation.id));
                      }
                    }}
                  />
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{invitation.name}</div>
                    <div className="text-sm text-gray-500">{invitation.email}</div>
                    <div className="text-sm text-gray-500">{invitation.phone}</div>
                    <div className="text-xs text-gray-400">
                      {invitation.language} • {invitation.location}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {invitation.challenge ? (
                    <div className="max-w-xs">
                      <div className="text-sm text-gray-900">
                        {invitation.challenge.length > 100 
                          ? `${invitation.challenge.substring(0, 100)}...` 
                          : invitation.challenge
                        }
                      </div>
                      {invitation.challenge.length > 100 && (
                        <button className="text-xs text-blue-600 hover:text-blue-800">
                          View full
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">No challenge shared</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    invitation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    invitation.status === 'approved' ? 'bg-green-100 text-green-800' :
                    invitation.status === 'used' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {invitation.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(invitation.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-900">View</button>
                    <button className="text-green-600 hover:text-green-900">Approve</button>
                    <button className="text-red-600 hover:text-red-900">Reject</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredInvitations.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No invitations found
        </div>
      )}
    </div>
  );
} 