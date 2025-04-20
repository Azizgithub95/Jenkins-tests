pipeline { 
  agent any

    triggers {
    cron('0 9 * * *')
    cron('0 21 * * *')
  }
  

  stages {
    stage('Checkout') {
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
            echo '--- RUN Cypress ---'
            bat """
              npx cypress run ^
                --reporter mochawesome ^
                --reporter-options ^
reportDir=reports\\\\cypress,reportFilename=index,overwrite=true,html=true,json=false,inlineAssets=true
            """
            bat 'dir reports\\\\cypress'
          }
        }

        stage('Newman') {
          steps {
            echo '--- RUN Newman ---'
            bat 'if not exist reports\\newman mkdir reports\\newman'
            bat """
              newman run MOCK_AZIZ_SERVEUR.postman_collection.json ^
                -r html ^
                --reporter-html-export reports\\\\newman\\\\newman-report.html
            """
            bat 'dir reports\\\\newman'
          }
        }

        stage('K6 (screenshot)') {
          steps {
            echo '--- RUN K6 (export + screenshot) ---'
            bat 'if not exist reports\\k6 mkdir reports\\k6'
            bat 'k6 run test_k6.js --summary-export=reports\\k6\\summary.json'
            // génère le PNG à partir du JSON
            bat 'python generate_k6_screenshot.py reports\\k6\\summary.json reports\\k6\\screenshot.png'
            bat 'dir reports\\k6'
          }
        }
      }
    }

    stage('Publish Reports & Screenshot') {
      steps {
        // 1) Publier le rapport Cypress
        publishHTML([
          reportDir             : 'reports/cypress',
          reportFiles           : 'index.html',
          reportName            : 'Cypress Report',
          keepAll               : true,
          alwaysLinkToLastBuild : true,
          allowMissing          : false
        ])

        // 2) Publier le rapport Newman
        publishHTML([
          reportDir             : 'reports/newman',
          reportFiles           : 'newman-report.html',
          reportName            : 'Newman Report',
          keepAll               : true,
          alwaysLinkToLastBuild : true,
          allowMissing          : false
        ])

        // 3) Archiver le screenshot K6
        archiveArtifacts(
          artifacts  : 'reports/k6/screenshot.png',
          fingerprint: true
        )
      }
    }
  }

  post {
    always {
      echo 'Build terminé.'
    }
  


    success {
      emailext subject: "Build Success: ${currentBuild.fullDisplayName}",
                body: "Le build ${currentBuild.fullDisplayName} a réussi.\n\nConsultez les détails ici : ${env.BUILD_URL}",
                to: 'ton.adresse@mail.com'
    }
    failure {
      emailext subject: "Build Failed: ${currentBuild.fullDisplayName}",
                body: "Le build ${currentBuild.fullDisplayName} a échoué.\n\nConsultez les détails ici : ${env.BUILD_URL}",
                to: 'aziztesteur@hotmail.com'
    }
  }
}





