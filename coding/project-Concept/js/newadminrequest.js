(() => {
  const SUPABASE_URL = 'https://rdubzgyjyyumapvifwuq.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkdWJ6Z3lqeXl1bWFwdmlmd3VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyOTI0OTAsImV4cCI6MjA4MDg2ODQ5MH0.ZNgFLKO0z5xpASKFAr1uXp8PPmNsdpwN58I7dP6ZIeM';
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // DOM elements
  const requestsTable = document.getElementById('requestsTable');
  const loadingRow = document.getElementById('loadingRow');
  const logoutBtn = document.getElementById('logoutBtn');

  // Session management
  const getSession = () => {
    const sessionData = localStorage.getItem('superadmin_session');
    if (!sessionData) return null;
    try {
      const session = JSON.parse(sessionData);
      if (Date.now() - session.timestamp > 24 * 60 * 60 * 1000) {
        localStorage.removeItem('superadmin_session');
        return null;
      }
      return session;
    } catch {
      return null;
    }
  };

  const clearSession = () => {
    localStorage.removeItem('superadmin_session');
  };

  // Check authentication
  const checkAuth = async () => {
    const session = getSession();
    if (!session) {
      window.location.href = 'Superadminindex.html';
      return false;
    }

    // Verify session is still valid
    const { data, error } = await supabase
      .from('Superadmin')
      .select('id, email, name, is_active')
      .eq('email', session.email)
      .eq('id', session.id)
      .single();

    if (error || !data || !data.is_active) {
      clearSession();
      window.location.href = 'Superadminindex.html';
      return false;
    }

    return true;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format organization type
  const formatOrgType = (orgType, orgTypeOther) => {
    if (!orgType) return '-';
    const typeMap = {
      'government': 'Government',
      'private': 'Private',
      'mobile_shop': 'Mobile Shop',
      'court': 'Court',
      'college_school': 'College/School',
      'hospital': 'Hospital',
      'bank': 'Bank',
      'restaurant': 'Restaurant',
      'retail': 'Retail',
      'ngo': 'NGO',
      'others': orgTypeOther || 'Others'
    };
    return typeMap[orgType] || orgType;
  };

  // Get status badge HTML
  const getStatusBadge = (status) => {
    const statusMap = {
      'approval_pending': { text: 'Approval Pending', class: 'pending' },
      'approved': { text: 'Approved', class: 'approved' },
      'under_customization': { text: 'Under Customization', class: 'in_progress' },
      'customization_complete': { text: 'Customization Complete', class: 'approved' },
      'in_progress': { text: 'In Progress', class: 'in_progress' },
      'rejected': { text: 'Rejected', class: 'rejected' },
      'pending': { text: 'Pending', class: 'pending' }
    };
    const statusInfo = statusMap[status] || statusMap['approval_pending'];
    return `<span class="status-badge ${statusInfo.class}">${statusInfo.text}</span>`;
  };


  // Load new admin requests
  const loadNewAdminRequests = async () => {
    try {
      const { data: requests, error } = await supabase
        .from('newadminrequests')
        .select('*')
        .order('requested_at', { ascending: false });

      if (error) {
        console.error('Error loading requests:', error);
        loadingRow.innerHTML = '<span colspan="6" style="color: #ef4444;">Error loading requests. Please refresh the page.</span>';
        return;
      }

      if (loadingRow) {
        loadingRow.remove();
      }

      if (!requests || requests.length === 0) {
        requestsTable.innerHTML += `
          <div class="table-row muted">
            <span colspan="6">No new admin requests found.</span>
          </div>
        `;
        return;
      }

      requests.forEach(request => {
        const row = document.createElement('div');
        row.className = 'table-row';
        row.innerHTML = `
          <span style="font-family: 'Courier New', monospace; font-weight: 600; color: var(--primary);">${request.reference_number || '-'}</span>
          <span>${request.admin_name || '-'}</span>
          <span>${request.admin_email || '-'}</span>
          <span>${request.organization_name || '-'}</span>
          <span>${getStatusBadge(request.status)}</span>
          <span>
            <button class="action-btn view-btn" onclick="showViewDetailsPopup('${request.id}')">
              View Details
            </button>
          </span>
        `;
        requestsTable.appendChild(row);
      });
    } catch (err) {
      console.error('Error:', err);
      if (loadingRow) {
        loadingRow.innerHTML = '<span colspan="6" style="color: #ef4444;">Error loading requests. Please refresh the page.</span>';
      }
    }
  };

  // Show view details popup
  window.showViewDetailsPopup = async (requestId) => {
    const popup = document.getElementById('viewDetailsPopup');
    if (!popup) return;

    try {
      // Fetch full request details with latest data
      const { data, error } = await supabase
        .from('newadminrequests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (error || !data) {
        alert('Error loading request details: ' + (error?.message || 'Unknown error'));
        return;
      }

      // Store request ID for status update
      window.currentRequestId = requestId;
      
      // Store initial status for change detection
      window.initialStatus = data.status;

      // Populate details
      document.getElementById('detailReference').textContent = data.reference_number || '-';
      
      // Status display
      const statusDisplayElement = document.getElementById('detailStatusDisplay');
      if (statusDisplayElement) {
        statusDisplayElement.innerHTML = getStatusBadge(data.status);
      }
      
      // Status select dropdown
      const statusSelect = document.getElementById('statusSelect');
      if (statusSelect) {
        statusSelect.value = data.status || 'approval_pending';
        
        // Show/hide rejection reason field based on selected status
        const rejectionReasonField = document.getElementById('rejectionReasonField');
        const rejectionReasonInput = document.getElementById('rejectionReasonInput');
        const rejectionReasonRequired = document.getElementById('rejectionReasonRequired');
        
        const toggleRejectionReason = () => {
          if (statusSelect.value === 'rejected') {
            if (rejectionReasonField) rejectionReasonField.classList.remove('hidden');
            if (rejectionReasonRequired) rejectionReasonRequired.classList.remove('hidden');
            if (rejectionReasonInput) {
              rejectionReasonInput.setAttribute('required', 'required');
              rejectionReasonInput.value = data.rejection_reason || '';
            }
          } else {
            if (rejectionReasonField) rejectionReasonField.classList.add('hidden');
            if (rejectionReasonRequired) rejectionReasonRequired.classList.add('hidden');
            if (rejectionReasonInput) {
              rejectionReasonInput.removeAttribute('required');
            }
          }
        };
        
        statusSelect.addEventListener('change', toggleRejectionReason);
        toggleRejectionReason(); // Initial check
      }
      
      // Admin notes
      const adminNotesInput = document.getElementById('adminNotesInput');
      if (adminNotesInput) {
        adminNotesInput.value = data.notes || '';
      }

      // Personal information
      document.getElementById('detailName').textContent = data.admin_name || '-';
      document.getElementById('detailEmail').textContent = data.admin_email || '-';
      document.getElementById('detailPhone').textContent = data.admin_phone || '-';
      document.getElementById('detailRole').textContent = data.role || '-';

      // Organization information
      document.getElementById('detailOrgName').textContent = data.organization_name || '-';
      document.getElementById('detailOrgType').textContent = formatOrgType(data.organization_type, data.organization_type_other);

      // Address information
      document.getElementById('detailAddress').textContent = data.address || '-';
      document.getElementById('detailCity').textContent = data.city || '-';
      document.getElementById('detailState').textContent = data.state || '-';
      document.getElementById('detailZipCode').textContent = data.zip_code || '-';
      document.getElementById('detailCountry').textContent = data.country || '-';

      // Request details
      // Features needed - display as chips
      const featuresContainer = document.getElementById('detailFeatures');
      if (data.features_needed) {
        const features = data.features_needed.split(',').map(f => f.trim()).filter(Boolean);
        featuresContainer.innerHTML = features.map(feature => 
          `<span class="feature-chip">${feature}</span>`
        ).join('');
      } else {
        featuresContainer.textContent = '-';
      }

      document.getElementById('detailReason').textContent = data.reason_for_access || '-';
      document.getElementById('detailNotes').textContent = data.additional_notes || '-';

      // Display identity proof
      const identityContainer = document.getElementById('identityProofContainer');
      if (data.identity_proof_url) {
        const fileExt = data.identity_proof_filename?.split('.').pop()?.toLowerCase() || '';
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt);
        const isPdf = fileExt === 'pdf';
        const proofUrl = data.identity_proof_url;
        
        if (isImage) {
          identityContainer.innerHTML = `
            <img src="${proofUrl}" alt="Identity Proof" 
                 onclick="window.open('${proofUrl}', '_blank')" />
            <p>
              ${data.identity_proof_filename || 'Identity Proof'} - Click to view full size
            </p>
          `;
        } else if (isPdf) {
          // For PDFs, create a viewer with download option
          identityContainer.innerHTML = `
            <div class="identity-proof-document">
              <svg viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" stroke-width="2"/>
                <polyline points="14 2 14 8 20 8" fill="none" stroke="currentColor" stroke-width="2"/>
                <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2"/>
                <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2"/>
                <polyline points="10 9 9 9 8 9" fill="none" stroke="currentColor" stroke-width="2"/>
              </svg>
              <p>${data.identity_proof_filename || 'Document'}</p>
              <div class="document-actions">
                <button onclick="viewDocument('${proofUrl.replace(/'/g, "\\'")}', 'pdf')" class="btn-view-document">
                  View PDF
                </button>
                <a href="${proofUrl}" download="${data.identity_proof_filename || 'document.pdf'}" class="btn-download-document">
                  Download
                </a>
              </div>
            </div>
          `;
        } else {
          // For other documents
          identityContainer.innerHTML = `
            <div class="identity-proof-document">
              <svg viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" stroke-width="2"/>
                <polyline points="14 2 14 8 20 8" fill="none" stroke="currentColor" stroke-width="2"/>
                <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2"/>
                <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2"/>
                <polyline points="10 9 9 9 8 9" fill="none" stroke="currentColor" stroke-width="2"/>
              </svg>
              <p>${data.identity_proof_filename || 'Document'}</p>
              <div class="document-actions">
                <button onclick="viewDocument('${proofUrl.replace(/'/g, "\\'")}', '${fileExt}')" class="btn-view-document">
                  View Document
                </button>
                <a href="${proofUrl}" download="${data.identity_proof_filename || 'document'}" class="btn-download-document">
                  Download
                </a>
              </div>
            </div>
          `;
        }
      } else {
        identityContainer.innerHTML = '<p style="color: var(--muted);">No identity proof uploaded</p>';
      }

      // Timestamps
      document.getElementById('detailRequestedAt').textContent = formatDate(data.requested_at);
      document.getElementById('detailProcessedAt').textContent = formatDate(data.processed_at) || '-';

      // Rejection information
      const rejectionSection = document.getElementById('rejectionSection');
      if (data.status === 'rejected' && data.rejection_reason) {
        rejectionSection.classList.remove('hidden');
        document.getElementById('detailRejectionReason').textContent = data.rejection_reason;
      } else {
        rejectionSection.classList.add('hidden');
      }

      // Administrator notes
      const adminNotesSection = document.getElementById('adminNotesSection');
      if (data.notes) {
        adminNotesSection.classList.remove('hidden');
        document.getElementById('detailAdminNotes').textContent = data.notes;
      } else {
        adminNotesSection.classList.add('hidden');
      }

      // Show popup
      popup.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    } catch (err) {
      console.error('Error loading details:', err);
      alert('Error loading request details. Please try again.');
    }
  };

  // Save status update
  const saveStatusUpdate = async () => {
    // Validate request ID
    if (!window.currentRequestId) {
      console.error('No request ID found. currentRequestId:', window.currentRequestId);
      alert('No request selected. Please close and reopen the details popup.');
      return;
    }

    const statusSelect = document.getElementById('statusSelect');
    const rejectionReasonInput = document.getElementById('rejectionReasonInput');
    const adminNotesInput = document.getElementById('adminNotesInput');
    
    if (!statusSelect) {
      alert('Status select element not found.');
      return;
    }

    const newStatus = statusSelect.value;
    const rejectionReason = rejectionReasonInput?.value.trim() || null;
    // Notes are optional - allow null or empty string
    const notes = adminNotesInput?.value.trim() || null;

    // Validate rejection reason if status is rejected
    if (newStatus === 'rejected' && !rejectionReason) {
      alert('Rejection reason is required when status is set to Rejected.');
      if (rejectionReasonInput) rejectionReasonInput.focus();
      return;
    }

    // Notes are optional - no validation needed

    // Get current session
    const session = getSession();
    if (!session) {
      alert('Session expired. Please login again.');
      window.location.href = 'Superadminindex.html';
      return;
    }

    // Verify the request exists before updating
    const { data: existingRequest, error: checkError } = await supabase
      .from('newadminrequests')
      .select('id, status')
      .eq('id', window.currentRequestId)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking request existence:', checkError);
      alert('Error verifying request: ' + checkError.message);
      return;
    }

    if (!existingRequest) {
      console.error('Request not found with ID:', window.currentRequestId);
      alert('Request not found. It may have been deleted. Please refresh the page.');
      return;
    }

    try {
      // Prepare update data - always update these fields
      const updateData = {
        status: newStatus,
        notes: notes || null, // Allow null if empty
        updated_at: new Date().toISOString()
      };

      // Handle processed_at and processed_by based on status
      if (['approved', 'rejected', 'customization_complete'].includes(newStatus)) {
        // Set processed_at and processed_by for final states
        // Only update processed_at if not already set, or if changing to a processed state
        if (!window.initialStatus || !['approved', 'rejected', 'customization_complete'].includes(window.initialStatus)) {
          updateData.processed_at = new Date().toISOString();
        }
        // Always update processed_by to track who made the change
        updateData.processed_by = session.id;
      } else {
        // For non-processed states, explicitly set processed_at to null to clear it
        updateData.processed_at = null;
        // Always update processed_by to track who last updated it
        updateData.processed_by = session.id;
      }

      // Handle rejection reason
      if (newStatus === 'rejected') {
        // Set rejection reason if status is rejected
        updateData.rejection_reason = rejectionReason || null;
      } else {
        // Clear rejection reason if status is not rejected
        updateData.rejection_reason = null;
      }

      // Update the request in Supabase using the database function
      console.log('Updating request with ID:', window.currentRequestId);
      console.log('Update data:', JSON.stringify(updateData, null, 2));
      console.log('Expected status:', newStatus);
      
      // First, check what the current status is
      const { data: beforeUpdate, error: beforeError } = await supabase
        .from('newadminrequests')
        .select('id, status')
        .eq('id', window.currentRequestId)
        .single();
      
      if (beforeError || !beforeUpdate) {
        console.error('Error fetching before update:', beforeError);
        throw new Error('Could not fetch request before update: ' + (beforeError?.message || 'Request not found'));
      }
      
      console.log('Status before update:', beforeUpdate.status);
      
      // Use the database function to update (bypasses RLS)
      let updateResult = null;
      let updateError = null;
      
      const { data: functionResult, error: functionError } = await supabase.rpc('update_newadminrequest_status', {
        p_request_id: window.currentRequestId,
        p_new_status: newStatus,
        p_admin_notes: notes,
        p_rejection_reason: rejectionReason,
        p_processed_by: session.id
      });
      
      // If function doesn't exist or fails, fall back to direct update
      if (functionError) {
        console.warn('Function call failed, trying direct update:', functionError);
        
        // Fallback to direct update
        const result = await supabase
          .from('newadminrequests')
          .update(updateData)
          .eq('id', window.currentRequestId)
          .select('id, status, updated_at');
        
        updateResult = result.data;
        updateError = result.error;
      } else {
        // Function succeeded
        console.log('Function call successful:', functionResult);
        
        // Fetch the updated record to verify
        const { data: fetchedResult, error: fetchError } = await supabase
          .from('newadminrequests')
          .select('id, status, updated_at')
          .eq('id', window.currentRequestId)
          .single();
        
        if (fetchError) {
          updateError = fetchError;
        } else {
          updateResult = fetchedResult ? [fetchedResult] : null; // Convert to array format
        }
      }

      if (updateError) {
        console.error('Supabase update error:', updateError);
        console.error('Request ID used:', window.currentRequestId);
        console.error('Error code:', updateError.code);
        console.error('Error message:', updateError.message);
        console.error('Error details:', JSON.stringify(updateError, null, 2));
        
        // Check if it's a constraint violation
        if (updateError.code === '23514' || 
            updateError.message?.includes('violates check constraint') || 
            updateError.message?.includes('check constraint') ||
            updateError.message?.includes('new row violates row-level security policy')) {
          const errorMsg = 'Database constraint violation: The status "' + newStatus + '" may not be allowed.\n\n' +
                          'Error: ' + updateError.message + '\n\n' +
                          'Please run the SQL file "final_fix_status_constraint.sql" in Supabase SQL Editor.\n\n' +
                          'This will update the database constraint to allow the new status values.';
          alert(errorMsg);
          throw new Error('Status constraint violation: ' + updateError.message);
        }
        
        throw updateError;
      }

      // Check if update returned any rows
      if (!updateResult || updateResult.length === 0) {
        console.error('Update returned no rows - update may have been blocked');
        console.error('This could mean:');
        console.error('1. RLS policy is blocking the update');
        console.error('2. The record was deleted');
        console.error('3. The ID does not match');
        
        // Try to fetch the record to see if it still exists
        const { data: checkRecord } = await supabase
          .from('newadminrequests')
          .select('id, status')
          .eq('id', window.currentRequestId)
          .maybeSingle();
        
        if (!checkRecord) {
          throw new Error('Update failed: Record not found. It may have been deleted.');
        }
        
        // The record exists but update returned no rows
        // This usually means the constraint rejected the status value
        const errorMsg = 'Update was blocked by the database!\n\n' +
                        'Attempted to set status to: "' + newStatus + '"\n' +
                        'Current status in database: "' + checkRecord.status + '"\n\n' +
                        'The database constraint likely does not allow "' + newStatus + '".\n\n' +
                        'Solution: Run "simple_fix_constraint.sql" in Supabase SQL Editor.\n\n' +
                        'This will update the constraint to allow all required status values.';
        
        alert(errorMsg);
        throw new Error('Update returned no rows. The status "' + newStatus + '" may not be allowed by the database constraint. Please run simple_fix_constraint.sql');
      }

      // Check what status was actually saved in the update result
      const savedStatus = updateResult[0]?.status;
      console.log('Status from update result:', savedStatus);
      
      if (savedStatus && savedStatus !== newStatus) {
        console.error('Status mismatch in update result!');
        console.error('Expected:', newStatus);
        console.error('Got from update result:', savedStatus);
        
        const errorMsg = 'Status was converted by the database!\n\n' +
                        'Expected: "' + newStatus + '"\n' +
                        'Got: "' + savedStatus + '"\n\n' +
                        'This means the database constraint or default value is converting your status.\n\n' +
                        'Please run "final_fix_status_constraint.sql" in Supabase SQL Editor to fix the constraint.';
        alert(errorMsg);
        throw new Error('Status was converted from "' + newStatus + '" to "' + savedStatus + '"');
      }

      // Wait a moment for the update to propagate (if needed)
      await new Promise(resolve => setTimeout(resolve, 200));

      // Verify update was successful by fetching the updated record
      const { data: verifyRequest, error: verifyError } = await supabase
        .from('newadminrequests')
        .select('id, status, updated_at, notes, rejection_reason, processed_at, processed_by')
        .eq('id', window.currentRequestId)
        .maybeSingle();

      if (verifyError) {
        console.error('Error verifying update:', verifyError);
        // Don't throw here - the update might have succeeded but we can't verify
        console.warn('Update may have succeeded but could not verify');
      }

      if (!verifyRequest) {
        console.error('Update verification failed: Request not found after update');
        console.error('Request ID:', window.currentRequestId);
        throw new Error('Update may have failed: Could not verify the update. Please refresh the page to check.');
      }

      console.log('Status from database:', verifyRequest.status);
      console.log('Expected status:', newStatus);

      // Verify the status actually changed
      if (verifyRequest.status !== newStatus) {
        console.error('Status mismatch detected!');
        console.error('  Expected:', newStatus);
        console.error('  Got from DB:', verifyRequest.status);
        console.error('  Update result:', updateResult);
        
        // Provide helpful error message
        const errorMsg = 'Status update mismatch detected.\n\n' +
                        'Expected: "' + newStatus + '"\n' +
                        'Got from database: "' + verifyRequest.status + '"\n\n' +
                        'This usually means:\n' +
                        '1. The database constraint doesn\'t allow "' + newStatus + '"\n' +
                        '2. Or there\'s a default value converting it\n\n' +
                        'Please ensure the SQL migration "update_newadminrequests_status_values.sql" has been run in Supabase SQL Editor.\n\n' +
                        'The update may have been rejected or converted by the database.';
        
        alert(errorMsg);
        throw new Error('Status update mismatch: Database returned "' + verifyRequest.status + '" instead of "' + newStatus + '". Please check database constraints.');
      }

      console.log('Update verified successfully.');
      console.log('  - Status:', verifyRequest.status);
      console.log('  - Updated at:', verifyRequest.updated_at);
      console.log('  - Processed at:', verifyRequest.processed_at);
      console.log('  - Processed by:', verifyRequest.processed_by);
      
      // Verify processed_at logic
      if (['approved', 'rejected', 'customization_complete'].includes(newStatus)) {
        if (!verifyRequest.processed_at) {
          console.warn('Warning: processed_at is not set for processed status:', newStatus);
        }
      } else {
        if (verifyRequest.processed_at) {
          console.warn('Warning: processed_at should be null for non-processed status, but got:', verifyRequest.processed_at);
        }
      }

      // Use verifyRequest as the updated request (it has the key fields we need)
      // Fetch full data for UI updates
      const { data: fullUpdatedRequest, error: fetchError } = await supabase
        .from('newadminrequests')
        .select('*')
        .eq('id', window.currentRequestId)
        .maybeSingle();

      let updatedRequest;
      if (fetchError || !fullUpdatedRequest) {
        console.warn('Could not fetch full updated request, using verified data');
        // Use the verified request data we already have
        updatedRequest = verifyRequest;
      } else {
        updatedRequest = fullUpdatedRequest;
      }

      // Update the status display in the popup immediately
      const statusDisplayElement = document.getElementById('detailStatusDisplay');
      if (statusDisplayElement) {
        statusDisplayElement.innerHTML = getStatusBadge(updatedRequest.status);
      }

      // Update the status select dropdown
      if (statusSelect) {
        statusSelect.value = updatedRequest.status;
      }

      // Update rejection section visibility
      const rejectionSection = document.getElementById('rejectionSection');
      if (updatedRequest.status === 'rejected' && updatedRequest.rejection_reason) {
        if (rejectionSection) {
          rejectionSection.classList.remove('hidden');
          const rejectionReasonElement = document.getElementById('detailRejectionReason');
          if (rejectionReasonElement) {
            rejectionReasonElement.textContent = updatedRequest.rejection_reason;
          }
        }
      } else {
        if (rejectionSection) {
          rejectionSection.classList.add('hidden');
        }
      }

      // Update admin notes section
      const adminNotesSection = document.getElementById('adminNotesSection');
      if (updatedRequest.notes) {
        if (adminNotesSection) {
          adminNotesSection.classList.remove('hidden');
          const adminNotesElement = document.getElementById('detailAdminNotes');
          if (adminNotesElement) {
            adminNotesElement.textContent = updatedRequest.notes;
          }
        }
      } else {
        if (adminNotesSection) {
          adminNotesSection.classList.add('hidden');
        }
      }

      // Update processed_at display
      const processedAtElement = document.getElementById('detailProcessedAt');
      if (processedAtElement && updatedRequest.processed_at) {
        processedAtElement.textContent = formatDate(updatedRequest.processed_at);
      }

      alert('Status updated successfully!');
      
      // Reload the page to refresh the table and all displays
      window.location.reload();
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Error updating status: ' + (err.message || 'Unknown error'));
    }
  };

  // Hide view details popup
  const hideViewDetailsPopup = () => {
    const popup = document.getElementById('viewDetailsPopup');
    if (popup) {
      popup.classList.add('hidden');
      document.body.style.overflow = '';
      window.currentRequestId = null;
    }
  };

  // Save status button handler
  const saveStatusBtn = document.getElementById('saveStatusBtn');
  if (saveStatusBtn) {
    saveStatusBtn.addEventListener('click', saveStatusUpdate);
  }

  // Close popup handlers
  const closeDetailsPopupBtn = document.getElementById('closeDetailsPopup');
  if (closeDetailsPopupBtn) {
    closeDetailsPopupBtn.addEventListener('click', hideViewDetailsPopup);
  }

  // Close popup on overlay click
  const popupOverlay = document.getElementById('viewDetailsPopup');
  if (popupOverlay) {
    popupOverlay.addEventListener('click', (e) => {
      if (e.target === popupOverlay) {
        hideViewDetailsPopup();
      }
    });
  }

  // Close popup on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideViewDetailsPopup();
    }
  });

  // Logout handler
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to logout?')) {
        clearSession();
        window.location.href = 'Superadminindex.html';
      }
    });
  }

  // Initialize on page load
  const init = async () => {
    const isAuthenticated = await checkAuth();
    if (isAuthenticated) {
      await loadNewAdminRequests();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

