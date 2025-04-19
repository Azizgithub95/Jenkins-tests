pipeline {
    agent any

    environment {
        PATH = "${tool 'NodeJS 22.2.0'}/bin:${env.PATH}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                bat 'npm install'
                bat 'npm install --save-dev mochawesome mochawesome-merge mochawesome-report-generator'
                bat 'npm install -g newman newman-reporter-html'
            }
        }

        stage('Run Cypress tests') {
            steps {
                bat '''
                    npx cypress run ^
                        --reporter mochawesome ^
                        --reporter-options reportDir=reports\\mochawesome,overwrite=false,html=false,json=true
                '''
            }
        }

        stage('Generate Cypress report') {
            steps {
                bat '''
                    echo Listing JSON files:
                    dir reports\\mochawesome

                    timeout /t 2 > nul

                    if exist reports\\mochawesome\\*.json (
                        echo JSON file found, merging...
                        npx mochawesome-merge "reports/mochawesome/*.json" > reports/mochawesome/merged.json
                        npx marge reports/mochawesome/merged.json --reportDir reports/mochawesome --reportFilename cypress-report
                    ) else (
                        echo ERROR: No mochawesome JSON files found!
                        exit /b 1
                    )
                '''
            }
        }

        stage('Run Newman tests') {
            steps {
                bat '''
                    newman run collection.json -r html --reporter-html-export reports\\newman\\newman-report.html
                '''
            }
        }

        stage('Run K6 tests') {
            steps {
                bat 'k6 run --summary-export=reports\\k6\\summary.json k6-script.js'
            }
        }
    }

    post {
        always {
            echo 'Tests exécutés. Vérifie les rapports dans le dossier reports/.'
        }
    }
}
