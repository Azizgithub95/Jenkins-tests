pipeline {
    agent any

    stages {
        stage('Install dependencies') {
            steps {
                bat 'npm install'
                bat 'npm install --save-dev mochawesome mochawesome-merge mochawesome-report-generator'
                bat 'npm install -g newman newman-reporter-html'
            }
        }

        stage('Run Cypress tests') {
            steps {
                bat 'echo ---[ DEBUG: Before Cypress ]---'
                bat 'npx cypress run --reporter mochawesome --reporter-options reportDir=reports\\mochawesome,overwrite=false,html=false,json=true'
            }
        }

        stage('Generate Cypress report') {
            steps {
                bat 'echo Fusion des rapports JSON et génération HTML...'
                bat 'npx mochawesome-merge reports/mochawesome/*.json --output reports/mochawesome/merged.json'
                bat 'npx marge reports/mochawesome/merged.json --reportDir reports/mochawesome --reportFilename cypress-report.html'
            }
        }

        stage('Run Newman tests') {
            steps {
                bat 'echo ---[ DEBUG: Before Newman ]---'
                bat 'mkdir reports\\newman'
                bat 'newman run MOCK_AZIZ_SERVEUR.postman_collection.json -r cli,html --reporter-html-export reports\\newman\\report.html'
            }
        }

        stage('Run K6 tests') {
            steps {
                bat 'k6 run test_k6.js'
            }
        }
    }

    post {
        always {
            echo 'Tests exécutés. Vérifie les rapports dans le dossier reports/.'
        }
    }
}
