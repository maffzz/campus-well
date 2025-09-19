#!/bin/bash
echo "📋 Logs de CampusWell"
echo "===================="
docker compose -f docker-compose.prod.yml logs -f
