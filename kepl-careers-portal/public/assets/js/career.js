// career.js - Connects to the careers API and displays job listings
document.addEventListener('DOMContentLoaded', function() {
    const jobsContainer = document.getElementById('jobs-container');
    const noJobsMessage = document.getElementById('no-jobs-message');
    const loadingSpinner = document.getElementById('loading-spinner');
    const jobCountElement = document.getElementById('job-count');
    const filterSection = document.querySelector('.filter-section');
    
    // Show loading spinner initially
    noJobsMessage.style.display = 'none';
    
    // Function to fetch jobs from the API
    async function fetchJobs() {
      try {
        // Use relative path to your API
        const response = await fetch('http://localhost:3000/api/jobs');
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const jobs = await response.json();
        return jobs;
      } catch (error) {
        console.error('Error fetching jobs:', error);
        return [];
      } finally {
        // Hide loading spinner regardless of outcome
        loadingSpinner.style.display = 'none';
      }
    }
    
    // Function to generate HTML for job card
    function createJobCard(job) {
      const jobCard = document.createElement('div');
      jobCard.className = 'job-card';
      jobCard.dataset.department = job.department;
      
      // Format description to show only first 100 characters with ellipsis
      const shortDescription = job.description.length > 100 
        ? job.description.substring(0, 100) + '...' 
        : job.description;
      
      // Create tags HTML
      const tagsHtml = job.tags && job.tags.length > 0
        ? job.tags.map(tag => `<span class="job-tag">${tag}</span>`).join('')
        : '';
      
      jobCard.innerHTML = `
        <div class="job-header">
          <div class="job-department">${job.department}</div>
          <h3 class="job-title">${job.title}</h3>
          <div class="job-type">${job.jobType}</div>
        </div>
        <div class="job-content">
          <div class="job-description">${shortDescription}</div>
          <div class="job-tags">
            ${tagsHtml}
          </div>
          <div class="job-footer">
            <div class="job-salary">${job.salary}</div>
            <button class="apply-button" data-job-id="${job._id}">Apply Now</button>
          </div>
        </div>
      `;
      
      // Add click event for Apply button
      const applyButton = jobCard.querySelector('.apply-button');
      applyButton.addEventListener('click', () => {
        // You can replace this with your application logic
        alert(`Application process for ${job.title} will be implemented soon.`);
      });
      
      return jobCard;
    }
    
    // Function to generate department filter buttons
    function generateFilterButtons(jobs) {
      // Create a Set of unique departments
      const departments = new Set();
      departments.add('all'); // Add 'all' option
      
      jobs.forEach(job => {
        if (job.department) {
          departments.add(job.department);
        }
      });
      
      // Clear existing buttons except the 'All' button
      filterSection.innerHTML = '';
      
      // Create buttons for each department
      departments.forEach(department => {
        const button = document.createElement('button');
        button.className = 'filter-button';
        if (department === 'all') {
          button.classList.add('active');
          button.textContent = 'All Departments';
        } else {
          button.textContent = department;
        }
        button.dataset.filter = department;
        
        // Add click event
        button.addEventListener('click', () => {
          // Remove active class from all buttons
          document.querySelectorAll('.filter-button').forEach(btn => {
            btn.classList.remove('active');
          });
          
          // Add active class to clicked button
          button.classList.add('active');
          
          // Filter jobs
          filterJobs(department);
        });
        
        filterSection.appendChild(button);
      });
    }
    
    // Function to filter jobs by department
    function filterJobs(department) {
      const jobCards = document.querySelectorAll('.job-card');
      let visibleCount = 0;
      
      jobCards.forEach(card => {
        if (department === 'all' || card.dataset.department === department) {
          card.classList.remove('hidden');
          visibleCount++;
        } else {
          card.classList.add('hidden');
        }
      });
      
      // Update job count
      jobCountElement.textContent = visibleCount;
      
      // Show/hide no jobs message
      noJobsMessage.style.display = visibleCount === 0 ? 'block' : 'none';
    }
    
    // Initialize the page
    async function initPage() {
      const jobs = await fetchJobs();
      
      // Hide loading spinner
      loadingSpinner.style.display = 'none';
      
      if (jobs.length === 0) {
        // Show no jobs message if no jobs found
        noJobsMessage.style.display = 'block';
        jobCountElement.textContent = '0';
      } else {
        // Generate filter buttons
        generateFilterButtons(jobs);
        
        // Render job cards
        jobs.forEach(job => {
          const jobCard = createJobCard(job);
          jobsContainer.appendChild(jobCard);
        });
        
        // Update job count
        jobCountElement.textContent = jobs.length;
        
        // Hide no jobs message
        noJobsMessage.style.display = 'none';
      }
    }
    
    // Start the initialization
    initPage();
  });