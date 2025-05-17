// public/assets/js/careers.js
document.addEventListener('DOMContentLoaded', function() {
    const jobsContainer = document.getElementById('jobs-container');
    const filterButtons = document.querySelectorAll('.filter-button');
    const jobCount = document.getElementById('job-count');
    const noJobsMessage = document.getElementById('no-jobs-message');
    
    // Fetch jobs from the API
    async function fetchJobs() {
      try {
        const response = await fetch('/api/jobs');
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        
        const jobs = await response.json();
        
        // Clear existing jobs
        jobsContainer.innerHTML = '';
        
        // Render jobs
        if (jobs.length > 0) {
          jobs.forEach(job => {
            const jobCard = createJobCard(job);
            jobsContainer.appendChild(jobCard);
          });
          
          // Update job count
          jobCount.textContent = jobs.length;
          noJobsMessage.style.display = 'none';
        } else {
          jobCount.textContent = '0';
          noJobsMessage.style.display = 'block';
        }
        
        // Re-initialize the filter functionality
        initializeFilters();
      } catch (error) {
        console.error('Error fetching jobs:', error);
        jobsContainer.innerHTML = `
          <div class="alert alert-danger">
            Failed to load job listings. Please try again later.
          </div>
        `;
      }
    }
    
    // Create job card element from job data
    function createJobCard(job) {
      const jobCard = document.createElement('div');
      jobCard.className = 'job-card';
      jobCard.setAttribute('data-department', job.department);
      
      const tagsHTML = job.tags.map(tag => 
        `<span class="job-tag">${tag}</span>`
      ).join('');
      
      jobCard.innerHTML = `
        <div class="job-header">
          <span class="job-department">${job.department}</span>
          <h3 class="job-title">${job.title}</h3>
          <span class="job-type">${job.jobType}</span>
        </div>
        <div class="job-content">
          <p class="job-description">${job.description}</p>
          <div class="job-tags">
            ${tagsHTML}
          </div>
          <div class="job-footer">
            <span class="job-salary">${job.salary}</span>
            <button class="apply-button" data-job-id="${job._id}">Apply Now</button>
          </div>
        </div>
      `;
      
      return jobCard;
    }
    
    // Initialize filter functionality
    function initializeFilters() {
      const filterButtons = document.querySelectorAll('.filter-button');
      const jobCards = document.querySelectorAll('.job-card');
      
      filterButtons.forEach(button => {
        button.addEventListener('click', function() {
          // Remove active class from all buttons
          filterButtons.forEach(btn => btn.classList.remove('active'));
          
          // Add active class to clicked button
          this.classList.add('active');
          
          // Get the department to filter by
          const department = this.getAttribute('data-filter');
          
          // Filter the jobs
          filterJobs(department);
        });
      });
      
      // Apply button functionality
      const applyButtons = document.querySelectorAll('.apply-button');
      applyButtons.forEach(button => {
        button.addEventListener('click', function() {
          const jobTitle = this.closest('.job-card').querySelector('.job-title').textContent;
          alert(`You're applying for the ${jobTitle} position. Please mail your CV to KHB.hr@kalahanub.com`);
        });
      });
    }
    
    // Filter jobs by department
    function filterJobs(department) {
      const jobCards = document.querySelectorAll('.job-card');
      let visibleCount = 0;
      
      jobCards.forEach(card => {
        if(department === 'all' || card.getAttribute('data-department') === department) {
          card.classList.remove('hidden');
          visibleCount++;
        } else {
          card.classList.add('hidden');
        }
    });
    
    // Update job count
    jobCount.textContent = visibleCount;
    
    // Show or hide no jobs message
    if(visibleCount === 0) {
      noJobsMessage.style.display = 'block';
    } else {
      noJobsMessage.style.display = 'none';
    }
  }
  
  // Create department filter buttons based on available departments
  function createDepartmentFilters(jobs) {
    // Get unique departments from jobs
    const departments = ['all', ...new Set(jobs.map(job => job.department))];
    const filterSection = document.querySelector('.filter-section');
    
    // Clear existing filter buttons
    filterSection.innerHTML = '';
    
    // Create filter buttons
    departments.forEach(department => {
      const button = document.createElement('button');
      button.className = 'filter-button' + (department === 'all' ? ' active' : '');
      button.setAttribute('data-filter', department);
      button.textContent = department === 'all' ? 'All Departments' : department;
      filterSection.appendChild(button);
    });
    
    // Initialize filter button click events
    initializeFilters();
  }
  
  // Fetch jobs when the page loads
  fetchJobs();
});