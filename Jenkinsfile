pipeline {
  agent any

  stages {
    stage('Checkout SCM') {
      steps {
        checkout scm
      }
    }

    stage('Install dependencies') {
      steps {
        bat 'npm ci'
      }
    }

    stage('Run Tests') {
      parallel {
        stage('Cypress') {
          steps {
            echo '---[ DEBUG: Cypress ]---'
            // génère à la fois HTML et JSON dans reports\mochawesome
            bat """
              npx cypress run ^
                --reporter mochawesome ^
                --reporter-options reportDir=reports\\mochawesome,reportFilename=cypress-report,overwrite=true,html=true,json=true
            """
          }
        }

        stage('Newman') {
          steps {
            echo '---[ DEBUG: Newman ]---'
            bat 'if not exist reports\\newman mkdir reports\\newman'
            bat 'newman run MOCK_AZIZ_SERVEUR.postman_collection.json -r html --reporter-html-export reports\\newman\\newman-report.html'
          }
        }

        // on exécute K6 SANS rapport
        stage('K6') {
          steps {
            echo '---[ DEBUG: K6 ]---'
            bat 'k6 run test_k6.js'
          }
        }
      }
    }

    stage('Publish Reports') {
      steps {
        echo '📂 Publication du rapport Cypress…'
        publishHTML([
          reportName: 'Cypress Report',
          reportDir: 'reports/mochawesome',
          reportFiles: 'cypress-report.html',
          keepAll: true
        ])

        echo '📂 Publication du rapport Newman…'
        publishHTML([
          reportName: 'Newman Report',
          reportDir: 'reports/newman',
          reportFiles: 'newman-report.html',
          keepAll: true
        ])
      }
    }
  }
}
