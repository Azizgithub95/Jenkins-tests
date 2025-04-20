pipeline {
  agent any

  stages {
    // … tes autres stages …

    stage('Run Tests') {
      parallel {
        // … Cypress et Newman …

        stage('K6 (screenshot)') {
  steps {
    bat 'if not exist reports\\k6 mkdir reports\\k6'
    bat 'k6 run test_k6.js --summary-export=reports\\k6\\summary.json'
    bat 'python generate_k6_screenshot.py reports\\k6\\summary.json reports\\k6\\screenshot.png'
    bat 'dir reports\\k6'
  }
}

      }
    }

    stage('Publish Reports & Screenshot') {
      steps {
        // Cypress & Newman comme avant…
        // enfin on archive l’image K6
        archiveArtifacts artifacts: 'reports/k6/screenshot.png', fingerprint: true
      }
    }
  }

  post {
    always {
      echo 'Build terminé.'
    }
  }
}
