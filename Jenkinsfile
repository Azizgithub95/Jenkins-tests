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
        for %%f in (reports\\mochawesome\\*.json) do (
            type "%%f" >> reports\\mochawesome\\merged.json
        )
        npx marge reports\\mochawesome\\merged.json ^
            --reportDir reports\\mochawesome ^
            --reportFilename cypress-report
        '''
    }
}


        stage('Run Newman tests') {
            steps {
                bat '''
                newman run postman\\collection.json ^
                  -r html ^
                  --reporter-html-export reports\\newman-report.html
                '''
            }
        }

        stage('Run K6 tests') {
            steps {
                bat 'k6 run k6\\test_k6.js'
            }
        }
    }

    post {
        always {
            echo 'Tests exécutés. Vérifie les rapports dans le dossier reports/.'
        }
    }
}
