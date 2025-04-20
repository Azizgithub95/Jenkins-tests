pipeline {
    agent any

    environment {
        // Si tu as configuré un NodeJS tool dans Jenkins, adapte le nom
        PATH = "${tool 'NodeJS'}\\bin;${env.PATH}"
    }

    stages {
        stage('Install dependencies') {
            steps {
                bat 'npm install'
                bat 'npm install --save-dev mochawesome mochawesome-merge mochawesome-report-generator'
                // On installe désormais Newman localement avec son reporter HTML
                bat 'npm install --save-dev newman newman-reporter-html'
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
                bat 'npx mochawesome-merge reports\\mochawesome\\*.json --output reports\\mochawesome\\merged.json'
                bat 'npx marge reports\\mochawesome\\merged.json --reportDir reports\\mochawesome --reportFilename cypress-report.html'
                bat 'dir reports\\mochawesome'
            }
        }

        stage('Run Newman tests') {
            steps {
                bat 'echo ---[ DEBUG: Before Newman ]---'
                bat 'if not exist reports\\newman mkdir reports\\newman'
                bat 'npx newman run MOCK_AZIZ_SERVEUR.postman_collection.json -r cli,html --reporter-html-export reports\\newman\\report.html'
                bat 'echo [INFO] Newman finished.'
                bat 'dir reports\\newman'
            }
        }

        stage('Run K6 tests') {
            steps {
                bat 'echo ---[ DEBUG: Before K6 ]---'
                bat 'k6 run test_k6.js --out json=reports\\k6\\summary.json'
                // Capture automatique d’un screenshot de l’écran (Windows PowerShell)
                bat '''
                    if not exist reports\\k6 mkdir reports\\k6
                    powershell -Command ^
                      "Add-Type -AssemblyName System.Windows.Forms; ^
                       Add-Type -AssemblyName System.Drawing; ^
                       $bmp = New-Object System.Drawing.Bitmap([System.Windows.Forms.Screen]::PrimaryScreen.Bounds.Width, [System.Windows.Forms.Screen]::PrimaryScreen.Bounds.Height); ^
                       $g = [System.Drawing.Graphics]::FromImage($bmp); ^
                       $g.CopyFromScreen(0,0,0,0,$bmp.Size); ^
                       $bmp.Save('reports\\k6\\k6-screenshot.png');" 
                '''
                bat 'dir reports\\k6'
            }
        }
    }

    post {
        always {
            echo 'Tests exécutés. Vérifie les rapports dans le dossier reports/.'
            // On archive tous les rapports et le screenshot K6
            archiveArtifacts artifacts: 'reports/**/*', fingerprint: true
            // (Optionnel) si tu veux publier des rapports HTML via le plugin HTML Publisher :
            // publishHTML(target: [
            //   reportName: 'Cypress Report',
            //   reportDir: 'reports/mochawesome',
            //   reportFiles: 'cypress-report.html',
            //   keepAll: true,
            //   alwaysLinkToLastBuild: true
            // ])
        }
    }
}

