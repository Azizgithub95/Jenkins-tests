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
                bat 'npm install --save-dev mochawesome mochawesome-report-generator'
                bat 'npm install -g newman newman-reporter-html'
            }
        }

        stage('Run Cypress tests') {
            steps {
                bat '''
                    npx cypress run ^
                        --reporter mochawesome ^
                        --reporter-options reportDir=reports\\mochawesome,overwrite=true,html=true,json=true
                '''
            }
        }

        stage('Check Cypress report') {
            steps {
                bat '''
                    echo Vérification du rapport Cypress...
                    if exist reports\\mochawesome\\*.html (
                        echo ✅ Rapport Cypress généré avec succès.
                    ) else (
                        echo ❌ Aucun rapport Cypress trouvé !
                        exit /b 1
                    )
                '''
            }
        }

        stage('Run Newman tests') {
            steps {
                bat '''
                    echo Exécution des tests Newman...
                    newman run tests\\collection.json ^
                        -e tests\\environment.json ^
                        -r html ^
                        --reporter-html-export reports\\newman\\newman-report.html
                '''
            }
        }

        stage('Run K6 tests') {
            steps {
                bat '''
                    echo Exécution des tests K6...
                    k6 run tests\\script.js
                '''
            }
        }
    }

    post {
        always {
            echo 'Pipeline terminé. Vérifie le dossier "reports/" pour les résultats.'
        }
    }
}
