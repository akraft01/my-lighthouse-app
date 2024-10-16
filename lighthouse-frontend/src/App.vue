<template>
  <div id="app">
    <h1>Lighthouse Accessibility Report</h1>
    <form @submit.prevent="getLighthouseReport" class="form">
      <input v-model="url" type="text" placeholder="Enter URL" required class="input" />
      <button type="submit" class="button">Get Report</button>
    </form>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="report" class="report">
      <h2>Audit Report for {{ report.finalUrl }}</h2>
      <p>Lighthouse Version: {{ report.lighthouseVersion }}</p>
      <p>Fetch Time: {{ new Date(report.fetchTime).toLocaleString() }}</p>
      
      <div class="scores">
        <div v-for="(category, key) in mainCategories" :key="key" class="score">
          <h3>{{ formatTitle(key) }}</h3>
          <CircularProgress
            :progress="Math.round(category.score * 100)"
            :size="150"
            :color="getScoreColor(category.score * 100)"
          />
          <p>{{ Math.round(category.score * 100) }}%</p>
        </div>
      </div>

      <button @click="toggleDetails" class="button">
        {{ showDetails ? 'Hide Details' : 'Show Details' }}
      </button>

      <div v-if="showDetails" class="details">
        <h3>Audit Details</h3>
        <ul>
          <li v-for="(audit, key) in report.audits" :key="key">
            <h4>{{ formatTitle(key) }}</h4>
            <p>Score: {{ Math.round(audit.score * 100) }}%</p>
          </li>
        </ul>
      </div>

      <div v-if="report.audits['final-screenshot']">
        <h3>Final Screenshot</h3>
        <img :src="report.audits['final-screenshot'].details.data" alt="Final Screenshot" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import CircularProgress from './components/CircularProgress.vue';

export default {
  components: {
    CircularProgress,
  },
  data() {
    return {
      url: '',
      report: null,
      loading: false,
      error: null,
      showDetails: false,
    };
  },
  computed: {
    mainCategories() {
      if (!this.report || !this.report.categories) return {};
      const { performance, accessibility, 'best-practices': bestPractices, seo } = this.report.categories;
      const mainCategories = { performance, accessibility, 'best practices': bestPractices, seo };
      console.log('Main Categories:', mainCategories); 
      return mainCategories;
    },
  },
  methods: {
    async getLighthouseReport() {
      this.loading = true;
      this.error = null;
      this.report = null;
      try {
        const response = await axios.get(`/api/audit?url=${this.url}`);
        console.log('Lighthouse Report:', response.data); // Log the Lighthouse report
        this.report = response.data;
      } catch (error) {
        console.error('Error fetching the Lighthouse report:', error);
        this.error = `Failed to fetch the report. Please try again. Error: ${error.message}`;
      } finally {
        this.loading = false;
      }
    },
    toggleDetails() {
      this.showDetails = !this.showDetails;
    },
    formatTitle(title) {
      const titleMappings = {
        'aria-* attributes match their roles': 'ARIA Attributes Match Their Roles',
        'values assigned to role="" are valid aria roles': 'Values Assigned to Role are Valid ARIA Roles',
        
      };
      return titleMappings[title.toLowerCase()] || this.cleanTitle(title);
    },
    cleanTitle(title) {
      return title
        .replace(/<\/?[^>]+(>|$)/g, '')
        .replace(/`/g, '') 
        .replace(/\s+/g, ' ') 
        .replace(/-/g, ' ') 
        .replace(/_/g, ' ') 
        .replace(/\b\w/g, (l) => l.toUpperCase()); 
    },
    getScoreColor(score) {
      if (score >= 90) return '#0cce6b';
      if (score >= 50) return '#ffa400'; 
      return '#ff4e42'; 
    }
  },
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.form {
  margin-bottom: 20px;
}

.input {
  padding: 10px;
  margin-right: 10px;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.button {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.button:hover {
  background-color: #369b72;
}

.loading {
  font-size: 20px;
  color: #42b983;
}

.error {
  color: red;
  margin-top: 20px;
}

.report {
  text-align: left;
  margin: 0 auto;
  max-width: 800px;
}

.scores {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.score {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 10px;
  width: 180px;
  text-align: center;
}

.score h3 {
  margin-bottom: 10px;
}

.score p {
  margin-top: 10px;
  font-size: 18px;
  font-weight: bold;
}

.details {
  margin-top: 20px;
}

.details ul {
  list-style-type: none;
  padding: 0;
}

.details li {
  background-color: #f9f9f9;
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
}

.details h4 {
  margin: 0;
}

img {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  margin-top: 20px;
}
</style>
