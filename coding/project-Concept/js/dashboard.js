(() => {
  const SUPABASE_URL = 'https://rdubzgyjyyumapvifwuq.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkdWJ6Z3lqeXl1bWFwdmlmd3VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyOTI0OTAsImV4cCI6MjA4MDg2ODQ5MH0.ZNgFLKO0z5xpASKFAr1uXp8PPmNsdpwN58I7dP6ZIeM';
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Check if user is logged in
  const checkAuth = () => {
    const sessionData = localStorage.getItem('adminSession');
    if (!sessionData) {
      // Redirect to login if no session
      window.location.href = 'index.html';
      return null;
    }
    return JSON.parse(sessionData);
  };

  // DOM elements
  const profilePopup = document.getElementById('manageProfilePopup');
  const profileForm = document.getElementById('manageProfileForm');
  const closeProfilePopup = document.getElementById('closeProfilePopup');
  const cancelProfileBtn = document.getElementById('cancelProfileBtn');
  const profileMessage = document.getElementById('profileMessage');
  const manageProfileCard = document.getElementById('manageProfileCard');

  // Show profile popup
  const showProfilePopup = () => {
    if (profilePopup) {
      profilePopup.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      loadProfileData();
      // Re-initialize password toggles for dynamically loaded popup
      setTimeout(() => {
        if (window.initPasswordToggles) {
          window.initPasswordToggles();
        } else {
          // Trigger initialization by dispatching a custom event
          document.dispatchEvent(new Event('passwordTogglesInit'));
        }
      }, 100);
    }
  };

  // Hide profile popup
  const hideProfilePopup = () => {
    if (profilePopup) {
      profilePopup.classList.add('hidden');
      document.body.style.overflow = '';
      profileForm?.reset();
      if (profileMessage) {
        profileMessage.textContent = '';
        profileMessage.classList.add('hidden');
      }
    }
  };

  // Show message in profile form
  const showProfileMessage = (text, type = 'info') => {
    if (!profileMessage) return;
    profileMessage.textContent = text;
    profileMessage.classList.remove('hidden', 'success', 'error');
    if (type === 'success') profileMessage.classList.add('success');
    if (type === 'error') profileMessage.classList.add('error');
  };

  // Load profile data
  const loadProfileData = async () => {
    const session = checkAuth();
    if (!session) return;

    try {
      // Fetch latest admin data from Supabase
      const { data, error } = await supabase
        .from('admin')
        .select('*')
        .eq('id', session.id)
        .single();

      if (error || !data) {
        showProfileMessage('Error loading profile data.', 'error');
        return;
      }

      // Check if admin is still active
      if (!data.is_active) {
        hideProfilePopup();
        showInactiveStatusPopup(data);
        return;
      }

      // Populate form fields
      document.getElementById('profileName').value = data.name || '';
      document.getElementById('profileUsername').value = data.username || '';
      document.getElementById('profileEmail').value = data.email || '';
      document.getElementById('profilePassword').value = ''; // Clear password field
      document.getElementById('profilePin').value = data.pin || '';
      // Populate contact info fields
      document.getElementById('profilePhone').value = data.phone || '';
      document.getElementById('profileAddress').value = data.address || '';
      document.getElementById('profileCity').value = data.city || '';
      document.getElementById('profileState').value = data.state || '';
      document.getElementById('profileZipCode').value = data.zip_code || '';
      document.getElementById('profileCountry').value = data.country || '';
    } catch (err) {
      console.error('Error loading profile data:', err);
      showProfileMessage('Error loading profile data.', 'error');
    }
  };

  // Handle profile form submission
  const handleProfileSubmit = async (evt) => {
    evt.preventDefault();
    const session = checkAuth();
    if (!session) return;

    // Check admin status before submitting
    const adminData = await checkAdminStatus();
    if (adminData && !adminData.is_active) {
      hideProfilePopup();
      showInactiveStatusPopup(adminData);
      return;
    }

    showProfileMessage('Saving changes...');

    const name = document.getElementById('profileName')?.value?.trim();
    const username = document.getElementById('profileUsername')?.value?.trim();
    const email = document.getElementById('profileEmail')?.value?.trim();
    const password = document.getElementById('profilePassword')?.value?.trim();
    const pin = document.getElementById('profilePin')?.value?.trim() || null;
    // Get contact info fields
    const phone = document.getElementById('profilePhone')?.value?.trim() || null;
    const address = document.getElementById('profileAddress')?.value?.trim() || null;
    const city = document.getElementById('profileCity')?.value?.trim() || null;
    const state = document.getElementById('profileState')?.value?.trim() || null;
    const zipCode = document.getElementById('profileZipCode')?.value?.trim() || null;
    const country = document.getElementById('profileCountry')?.value?.trim() || null;

    if (!name || !username || !email) {
      showProfileMessage('Please fill all required fields.', 'error');
      return;
    }

    try {
      // Build update object - only include password if provided
      const updateData = {
        name,
        username,
        email,
        pin,
        phone,
        address,
        city,
        state,
        zip_code: zipCode,
        country
      };

      // Only update password if a new one is provided
      if (password && password.length > 0) {
        updateData.password = password;
      }

      const { error } = await supabase
        .from('admin')
        .update(updateData)
        .eq('id', session.id);

      if (error) {
        showProfileMessage('Error updating profile: ' + error.message, 'error');
        return;
      }

      // Update session data
      const updatedSession = {
        ...session,
        name,
        username,
        email
      };
      localStorage.setItem('adminSession', JSON.stringify(updatedSession));

      showProfileMessage('Profile updated successfully!', 'success');
      setTimeout(() => {
        hideProfilePopup();
      }, 1500);
    } catch (err) {
      console.error('Error updating profile:', err);
      showProfileMessage('An error occurred while updating profile.', 'error');
    }
  };

  // Check admin status from database
  const checkAdminStatus = async () => {
    const session = checkAuth();
    if (!session) return false;

    try {
      const { data, error } = await supabase
        .from('admin')
        .select('id, email, name, is_active')
        .eq('id', session.id)
        .single();

      if (error || !data) {
        return false;
      }

      return data;
    } catch (err) {
      console.error('Error checking admin status:', err);
      return false;
    }
  };

  // Check for rejected activation requests
  const checkRejectedRequest = async (email) => {
    try {
      const { data, error } = await supabase
        .from('adminactivationrequests')
        .select('id, notes, processed_at, status')
        .eq('admin_email', email)
        .eq('status', 'rejected')
        .order('processed_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error checking rejected request:', err);
      return null;
    }
  };

  // Show inactive status popup and logout
  const showInactiveStatusPopup = async (adminData) => {
    const inactivePopup = document.getElementById('inactiveStatusPopup');
    const inactiveMessage = document.getElementById('inactiveStatusMessage');
    const sendRequestBtn = document.getElementById('sendInactiveRequestBtn');
    const closeInactiveBtn = document.getElementById('closeInactivePopupBtn');
    const rejectionDetails = document.getElementById('inactiveRejectionDetails');
    const rejectionNotes = document.getElementById('inactiveRejectionNotes');
    const rejectionDate = document.getElementById('inactiveRejectionDate');

    if (!inactivePopup) return;

    // Store admin data for activation request
    inactivePopup.dataset.adminEmail = adminData.email;
    inactivePopup.dataset.adminName = adminData.name || '';

    // Clear any existing messages
    if (inactiveMessage) {
      inactiveMessage.textContent = '';
      inactiveMessage.classList.add('hidden');
    }

    // Check for rejected request
    const rejectedRequest = await checkRejectedRequest(adminData.email);
    if (rejectedRequest && rejectedRequest.notes) {
      // Show rejection details
      if (rejectionDetails) {
        rejectionDetails.classList.remove('hidden');
      }
      if (rejectionNotes) {
        rejectionNotes.textContent = rejectedRequest.notes || 'No reason provided';
      }
      if (rejectionDate && rejectedRequest.processed_at) {
        const processedDate = new Date(rejectedRequest.processed_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        rejectionDate.textContent = `Rejected on: ${processedDate}`;
      }
    } else {
      // Hide rejection details if no rejected request
      if (rejectionDetails) {
        rejectionDetails.classList.add('hidden');
      }
    }

    // Show popup
    inactivePopup.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Logout immediately
    localStorage.removeItem('adminSession');

    // Populate form with existing admin data if available
    if (adminData.name) {
      const nameInput = document.getElementById('inactiveRequestName');
      if (nameInput) nameInput.value = adminData.name;
    }
    if (adminData.phone) {
      const phoneInput = document.getElementById('inactiveRequestPhone');
      if (phoneInput) phoneInput.value = adminData.phone;
    }
    if (adminData.address) {
      const addressInput = document.getElementById('inactiveRequestAddress');
      if (addressInput) addressInput.value = adminData.address;
    }
    if (adminData.city) {
      const cityInput = document.getElementById('inactiveRequestCity');
      if (cityInput) cityInput.value = adminData.city;
    }
    if (adminData.state) {
      const stateInput = document.getElementById('inactiveRequestState');
      if (stateInput) stateInput.value = adminData.state;
    }
    if (adminData.zip_code) {
      const zipInput = document.getElementById('inactiveRequestZipCode');
      if (zipInput) zipInput.value = adminData.zip_code;
    }
    if (adminData.country) {
      const countryInput = document.getElementById('inactiveRequestCountry');
      if (countryInput) countryInput.value = adminData.country;
    }

    // Initialize file preview
    const fileInput = document.getElementById('inactiveIdentityProof');
    const filePreview = document.getElementById('inactiveFilePreview');
    if (fileInput && filePreview) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const fileSize = (file.size / 1024 / 1024).toFixed(2);
          filePreview.textContent = `Selected: ${file.name} (${fileSize} MB)`;
          filePreview.style.color = '#10b981';
        } else {
          filePreview.textContent = '';
        }
      });
    }

    // Handle form submission
    const inactiveForm = document.getElementById('inactiveActivationRequestForm');
    if (inactiveForm) {
      inactiveForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = inactivePopup.dataset.adminEmail;
        const name = document.getElementById('inactiveRequestName')?.value?.trim() || adminData.name || '';
        const phone = document.getElementById('inactiveRequestPhone')?.value?.trim() || null;
        const address = document.getElementById('inactiveRequestAddress')?.value?.trim() || null;
        const city = document.getElementById('inactiveRequestCity')?.value?.trim() || null;
        const state = document.getElementById('inactiveRequestState')?.value?.trim() || null;
        const zipCode = document.getElementById('inactiveRequestZipCode')?.value?.trim() || null;
        const country = document.getElementById('inactiveRequestCountry')?.value?.trim() || null;
        const identityProof = document.getElementById('inactiveIdentityProof')?.files[0];
        const additionalNotes = document.getElementById('inactiveRequestNotes')?.value?.trim() || null;

        if (!email) {
          if (inactiveMessage) {
            inactiveMessage.textContent = 'Error: Email not found.';
            inactiveMessage.classList.remove('hidden', 'success', 'error');
            inactiveMessage.classList.add('error');
          }
          return;
        }

        // Validate required fields
        if (!name || !phone || !identityProof) {
          if (inactiveMessage) {
            inactiveMessage.textContent = 'Please fill all required fields (Name, Phone, and Identity Proof).';
            inactiveMessage.classList.remove('hidden', 'success', 'error');
            inactiveMessage.classList.add('error');
          }
          return;
        }

        // Validate file size (max 5MB)
        if (identityProof.size > 5 * 1024 * 1024) {
          if (inactiveMessage) {
            inactiveMessage.textContent = 'File size must be less than 5MB.';
            inactiveMessage.classList.remove('hidden', 'success', 'error');
            inactiveMessage.classList.add('error');
          }
          return;
        }

        // Disable button
        if (sendRequestBtn) {
          sendRequestBtn.disabled = true;
          sendRequestBtn.innerHTML = '<span>Uploading & Sending Request...</span>';
        }

        if (inactiveMessage) {
          inactiveMessage.textContent = 'Uploading identity proof and sending request...';
          inactiveMessage.classList.remove('hidden', 'success', 'error');
          inactiveMessage.classList.add('success');
        }

        try {
          // Upload identity proof
          let identityProofUrl = null;
          let identityProofFilename = null;
          
          if (identityProof) {
            const fileExt = identityProof.name.split('.').pop();
            const fileName = `${email}_${Date.now()}.${fileExt}`;
            const reader = new FileReader();
            identityProofUrl = await new Promise((resolve, reject) => {
              reader.onload = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(identityProof);
            });
            identityProofFilename = fileName;
          }

          // Insert activation request into database
          const { data, error } = await supabase
            .from('adminactivationrequests')
            .insert([{
              admin_email: email,
              admin_name: name,
              admin_phone: phone,
              admin_address: address,
              admin_city: city,
              admin_state: state,
              admin_zip_code: zipCode,
              admin_country: country,
              identity_proof_url: identityProofUrl,
              identity_proof_filename: identityProofFilename,
              additional_notes: additionalNotes,
              status: 'pending',
              requested_at: new Date().toISOString()
            }]);

          if (error) {
            console.error('Error sending activation request:', error);
            if (inactiveMessage) {
              inactiveMessage.textContent = 'Failed to send request. Please try again.';
              inactiveMessage.classList.remove('success');
              inactiveMessage.classList.add('error');
            }
            if (sendRequestBtn) {
              sendRequestBtn.disabled = false;
              sendRequestBtn.innerHTML = '<span>Send Activation Request</span><span class="glow"></span>';
            }
            return;
          }

          // Success
          if (inactiveMessage) {
            inactiveMessage.textContent = 'Activation request sent successfully! The super admin will review your request.';
            inactiveMessage.classList.remove('error');
            inactiveMessage.classList.add('success');
          }
          if (sendRequestBtn) {
            sendRequestBtn.disabled = true;
            sendRequestBtn.innerHTML = '<span>Request Sent</span>';
          }

          // Hide rejection details since new request is sent
          if (rejectionDetails) {
            rejectionDetails.classList.add('hidden');
          }

          // Reset form
          if (inactiveForm) {
            inactiveForm.reset();
            if (filePreview) filePreview.textContent = '';
          }

          // Redirect to login after 3 seconds
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 3000);

        } catch (err) {
          console.error('Error:', err);
          if (inactiveMessage) {
            inactiveMessage.textContent = 'An error occurred. Please try again later.';
            inactiveMessage.classList.remove('success');
            inactiveMessage.classList.add('error');
          }
          if (sendRequestBtn) {
            sendRequestBtn.disabled = false;
            sendRequestBtn.innerHTML = '<span>Send Activation Request</span><span class="glow"></span>';
          }
        }
      });
    }

    // Handle close button
    if (closeInactiveBtn) {
      closeInactiveBtn.onclick = () => {
        window.location.href = 'index.html';
      };
    }
  };

  // Check authentication on page load
  const loadDashboard = async () => {
    const session = checkAuth();
    if (!session) return;

    // Check admin status immediately
    const adminData = await checkAdminStatus();
    if (adminData && !adminData.is_active) {
      showInactiveStatusPopup(adminData);
      return;
    }

    // Set up periodic status checking (every 30 seconds)
    setInterval(async () => {
      const currentAdminData = await checkAdminStatus();
      if (currentAdminData && !currentAdminData.is_active) {
        showInactiveStatusPopup(currentAdminData);
      }
    }, 30000); // Check every 30 seconds

    // Check status when page becomes visible again (user switches back to tab)
    document.addEventListener('visibilitychange', async () => {
      if (!document.hidden) {
        const currentAdminData = await checkAdminStatus();
        if (currentAdminData && !currentAdminData.is_active) {
          showInactiveStatusPopup(currentAdminData);
        }
      }
    });
  };

  // Handle logout
  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('adminSession');
      window.location.href = 'index.html';
    }
  };

  // Initialize
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }

  // Event listeners for profile management
  if (manageProfileCard) {
    manageProfileCard.addEventListener('click', showProfilePopup);
  }

  if (profileForm) {
    profileForm.addEventListener('submit', handleProfileSubmit);
  }

  if (closeProfilePopup) {
    closeProfilePopup.addEventListener('click', hideProfilePopup);
  }

  if (cancelProfileBtn) {
    cancelProfileBtn.addEventListener('click', hideProfilePopup);
  }

  // Close popup when clicking outside
  if (profilePopup) {
    profilePopup.addEventListener('click', (e) => {
      if (e.target === profilePopup) {
        hideProfilePopup();
      }
    });
  }

  // Close popup with ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && profilePopup && !profilePopup.classList.contains('hidden')) {
      hideProfilePopup();
    }
  });

  // Load dashboard on page load
  loadDashboard();
})();

