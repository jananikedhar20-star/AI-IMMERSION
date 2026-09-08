#!/usr/bin/env bash
export PATH="/Users/jananishreek/.gemini/antigravity/scratch/tools/apache-maven-3.9.9/bin:$PATH"
cd /Users/jananishreek/.gemini/antigravity/scratch/soa-guard-ai/backend
mvn spring-boot:run -Dmaven.repo.local=/Users/jananishreek/.gemini/antigravity/scratch/.m2/repository
