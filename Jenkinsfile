pipeline {
  agent { label 'contrôleur' }

  tools {
    // Assure-toi d'avoir défini un NodeJS nommé "NodeJS" dans Jenkins → Global Tool Configuration
    nodejs 'NodeJS'
  }

  environment {
    // Pour que npx trouve bien tes binaires locaux
    PATH = "${tool 'NodeJS'}\\bin;${env.PATH}"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install dependencies') {
      steps {
        // installe tout (y compris mochawesome, newman-reporter-html, etc.)
        bat 'npm install'
      }
    }

    stage('Run Cypress tests') {
      steps {
        bat 'echo ---[ DEBUG: Before Cypress ]---'
        bat 'npx cypress run --reporter mochawesome --reporter-options reportDir=reports\\mochawesome,overwrite=false,html=false,json=true'
      }
    }

    stage('Generate all reports') {
      steps {
        bat 'echo ---[ DEBUG: Launch generate-reports.sh ]---'
        // Ne touche pas à ce script, il génère déjà Newman + K6 + merge Cypress
        bat 'generate-reports.sh'
      }
    }
  }

  post {
    always {
      echo 'Build terminé — vérifie les rapports dans le dossier reports/.'

      // Archive tous les fichiers de reports pour les consulter depuis Jenkins
      archiveArtifacts artifacts: 'reports/**/*', fingerprint: true
    }
  }
}
