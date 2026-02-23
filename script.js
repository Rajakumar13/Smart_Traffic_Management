
  // Logout functionality
  document.getElementById('logoutBtn')?.addEventListener('click', function () {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
  });
  
  // Check login state on page load
  window.onload = function () {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn && window.location.pathname.endsWith('index.html')) {
      window.location.href = 'login.html';
    }
  };
  
  // Initialize Google Map
  let map;
  let directionsService;
  let directionsRenderer;
  
  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 28.6139, lng: 77.2090 }, // Default center (New Delhi)
      zoom: 12,
    });
  
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
  }
  // new section added on 22nd

  

  // Handle Vehicle Type Form Submission
  document.getElementById('vehicleForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
  
    const vehicleType = document.getElementById('vehicle-type').value;
    const source = document.getElementById('source').value;
    const destination = document.getElementById('destination').value;
    const routeResult = document.getElementById('route-result');
  
    if (!source || !destination) {
      alert('Please enter both source and destination.');
      return;
    }
  
    // Simulate finding the best route
    calculateAndDisplayRoute(source, destination, vehicleType);
  
    // Display route details
    routeResult.innerHTML = `
      <p>Best route for <strong>${vehicleType}</strong>:</p>
      <ul>
        <li>Source: ${source}</li>
        <li>Destination: ${destination}</li>
      </ul>
    `;
  });
  
  // Function to calculate and display the route
  function calculateAndDisplayRoute(source, destination, vehicleType) {
    const travelMode = getTravelMode(vehicleType);
  
    directionsService.route(
      {
        origin: source,
        destination: destination,
        travelMode: travelMode,
      },
      (response, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(response);
        } else {
          alert('Directions request failed due to ' + status);
        }
      }
    );
  }
  
  // Function to get travel mode based on vehicle type
  function getTravelMode(vehicleType) {
    switch (vehicleType) {
      case 'bike':
        return google.maps.TravelMode.BICYCLING;
      case 'truck':
      case 'bus':
        return google.maps.TravelMode.DRIVING;
      default:
        return google.maps.TravelMode.DRIVING;
    }
  }
  
  // Handle Video Upload Form Submission
  document.getElementById('videoUploadForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
  
    const fileInput = document.getElementById('traffic-video');
    const file = fileInput.files[0];
    const uploadStatus = document.getElementById('upload-status');
  
    if (!file) {
      alert('Please select a video file to upload.');
      return;
    }
  
    // Show uploading message
    uploadStatus.textContent = "Uploading...";
  
    // Simulate upload delay
    setTimeout(() => {
      // Show upload completed message
      uploadStatus.textContent = "Uploading Completed!";
  
      // Simulate video analysis (replace with actual analysis logic)
      setTimeout(() => {
        const dashboardContent = document.getElementById('dashboard-content');
        dashboardContent.innerHTML = `
          <h3>Traffic Analysis Results</h3>
          <div class="dashboard-stats">
            <div class="stat-card">
              <h4>Traffic Density</h4>
              <p>High</p>
            </div>
            <div class="stat-card">
              <h4>Average Speed</h4>
              <p>20 km/h</p>
            </div>
            <div class="stat-card">
              <h4>Congestion Level</h4>
              <p>Severe</p>
            </div>
          </div>
          <div class="dashboard-graph">
            <h4>Traffic Over Time</h4>
            <canvas id="trafficChart"></canvas>
          </div>
        `;
  
        // Simulate a traffic chart using Chart.js
        const ctx = document.getElementById('trafficChart').getContext('2d');
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00'],
            datasets: [{
              label: 'Traffic Density',
              data: [65, 59, 80, 81, 56, 55],
              borderColor: 'rgba(75, 192, 192, 1)',
              fill: false,
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }, 1000); // Simulate analysis delay
    }, 2000); // Simulate upload delay
  });
  
  // Initialize the map when the window loads
  window.onload = function () {
    initMap();
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn && window.location.pathname.endsWith('index.html')) {
      window.location.href = 'login.html';
    }
  };

  document
    .getElementById('payChallanForm')
    .addEventListener('submit', function(e) {
      e.preventDefault();
      const type = this.vehicleType.value;
      const num  = this.vehicleNumber.value;
      // TODO: replace alert with real payment integration
      alert(`Proceed to payment for ${type} (${num})`);
    });

