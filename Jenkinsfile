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
            echo '--- DEBUG: Cypress ---'
            bat """
              npx cypress run ^
                --reporter mochawesome ^
                --reporter-options reportDir=reports/mochawesome,overwrite=false,html=true,json=true
            """
          }
        }

        stage('Newman') {
          steps {
            echo '--- DEBUG: Newman ---'
            bat 'if not exist reports\\newman mkdir reports\\newman'
            bat 'newman run MOCK_AZIZ_SERVEUR.postman_collection.json -r cli,html --reporter-html-export reports\\newman\\newman-report.html'
          }
        }

        stage('K6') {
          steps {
            echo '--- DEBUG: K6 ---'
            // on exécute juste, sans produire de rapport
            bat 'k6 run test_k6.js'
          }
        }
      }
    }

    stage('Generate Cypress HTML') {
      steps {
        echo 'Fusion et génération du rapport Cypress…'
        // 1) merge JSON
        bat 'npx mochawesome-merge reports\\mochawesome\\*.json --output reports\\mochawesome\\merged.json'
        // 2) générer le HTML final
        bat 'npx marge reports\\mochawesome\\merged.json --reportDir reports\\mochawesome\\html --reportFilename cypress-report.html'
      }
    }
  }

  post {
    always {
      // Publication du rapport Cypress
      publishHTML(target: [
        reportDir   : 'reports/mochawesome/html',
        reportFiles : 'cypress-report.html',
        reportName  : 'Cypress Report',
        keepAll      : true,
        allowMissing: false
      ])
      // Publication du rapport Newman
      publishHTML(target: [
        reportDir   : 'reports/newman',
        reportFiles : 'newman-report.html',
        reportName  : 'Newman Report',
        keepAll      : true,
        allowMissing: false
      ])
    }
  }
}
