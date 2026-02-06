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
  echo "Starting static server on Linux..."

  # Kill any old server if running
  pkill -f "http-server public -p 3000" || true

  # Start server in background
  nohup npx http-server public -p 3000 -c-1 > /tmp/product-cards-server.log 2>&1 &
  SERVER_PID=$!

  # Wait until server is ready (max ~30s)
  for i in {1..30}; do
    if curl -sSf http://127.0.0.1:3000 > /dev/null; then
      echo "Server is up"
      break
    fi
    sleep 1
  done

  # Final check
  curl -I http://127.0.0.1:3000 || exit 1

  # Run Playwright tests
  npx playwright test || EXIT_CODE=$?

  # Stop server
  kill $SERVER_PID || true

  exit ${EXIT_CODE:-0}
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
