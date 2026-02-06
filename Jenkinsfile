pipeline {
  agent any

  options {
    timestamps()
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install') {
      steps {
        sh '''
          node -v
          npm -v

          # Clean install based on package-lock.json
          npm ci
          npm i -D http-server

          # Install browsers (needed on fresh agents)
          npx playwright install
        '''
      }
    }

    stage('Serve + E2E Tests') {
      steps {
        sh '''
          # Start static server in background
          $server = Start-Process -FilePath "npx" -ArgumentList "http-server public -p 3000 -c-1" -PassThru -WindowStyle Hidden
          try {
            # Wait until server is up
            $ok = $false
            for ($i = 0; $i -lt 30; $i++) {
              try {
                Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:3000" | Out-Null
                $ok = $true
                break
              } catch {
                Start-Sleep -Seconds 1
              }
            }

            if (-not $ok) { throw "Server did not become ready on http://127.0.0.1:3000" }

            # Run Playwright tests
            npx playwright test
          }
          finally {
            if ($server -and -not $server.HasExited) {
              Stop-Process -Id $server.Id -Force
            }
          }
        '''
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'playwright-report/**, test-results/**, server.log', allowEmptyArchive: true
    }
  }
}
