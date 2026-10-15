pipeline {
    agent any

    environment {
        PROJECT_NAME   = 'devops-test'
        DEPLOY_URL     = 'https://devops-test-thuan-m9yh.vercel.app/'
        IMAGE_NAME     = 'devops-test-thuan'
        CONTAINER_NAME = 'devops-web'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "Checkout OK - branch main"
            }
        }

        stage('Notify Start') {
            steps {
                script {
                    sendTelegram("""🚀 DEPLOY STARTED
Project: ${PROJECT_NAME}
Branch: main""")
                }
            }
        }

        stage('Install dependencies') {
            steps {
                sh '''
                    set -eu
                    docker build --target dependencies \
                      --tag "${IMAGE_NAME}-dependencies:${BUILD_NUMBER}" .
                '''
            }
        }

        stage('Build project') {
            steps {
                sh '''
                    set -eu
                    docker build --target build \
                      --tag "${IMAGE_NAME}-build:${BUILD_NUMBER}" .
                    docker run --rm "${IMAGE_NAME}-build:${BUILD_NUMBER}" \
                      ls -la /app/dist
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    set -eu
                    docker build --tag "${IMAGE_NAME}:${BUILD_NUMBER}" .
                    if docker inspect "${CONTAINER_NAME}" >/dev/null 2>&1; then
                      docker rm --force "${CONTAINER_NAME}"
                    fi
                    docker run --detach --restart unless-stopped \
                      --name "${CONTAINER_NAME}" \
                      --publish 3000:80 \
                      "${IMAGE_NAME}:${BUILD_NUMBER}"

                    attempt=0
                    until curl --fail --silent http://docker:3000/ >/dev/null; do
                      attempt=$((attempt + 1))
                      if [ "$attempt" -ge 15 ]; then
                        echo "Deployment health check failed at http://docker:3000/." >&2
                        docker logs "${CONTAINER_NAME}"
                        exit 1
                      fi
                      sleep 2
                    done
                    echo "Deployed successfully"
                    echo "Local: http://localhost:3000"
                    echo "URL: ${DEPLOY_URL}"
                '''
            }
        }
    }

    post {
        success {
            script {
                sendTelegram("""✅ DEPLOY SUCCESS
Project: ${PROJECT_NAME}
Branch: main
URL: ${DEPLOY_URL}""")
            }
        }
        failure {
            script {
                sendTelegram("""❌ DEPLOY FAILED
Project: ${PROJECT_NAME}
Branch: main
Please check Jenkins.""")
            }
        }
    }
}

def sendTelegram(String message) {
    try {
        withCredentials([
            string(credentialsId: 'TELEGRAM_BOT_TOKEN', variable: 'TOKEN'),
            string(credentialsId: 'TELEGRAM_CHAT_ID', variable: 'CHAT_ID')
        ]) {
            sh """
                curl -s -X POST "https://api.telegram.org/bot\${TOKEN}/sendMessage" \
                  --data-urlencode "chat_id=\${CHAT_ID}" \
                  --data-urlencode "text=${message}"
            """
        }
    } catch (err) {
        echo "Telegram skipped (chua cau hinh credentials): ${err}"
    }
}
