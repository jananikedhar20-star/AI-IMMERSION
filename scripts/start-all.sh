#!/usr/bin/env bash
echo "Starting SOA Guard AI Microservices..."
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
$DIR/start-ai.sh &
$DIR/start-backend.sh &
$DIR/start-frontend.sh &
wait
