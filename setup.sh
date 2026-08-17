#!/bin/bash
set -e

# Load nvm and use Node 20
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
if command -v nvm &> /dev/null; then
  nvm use 20 || nvm install 20
fi

echo "==> Installing dbt + DuckDB..."
pip install dbt-duckdb --quiet

echo "==> Running dbt seed + run..."
cd data
dbt seed --profiles-dir . --full-refresh
dbt run --profiles-dir .
cd ..

echo "==> Installing backend dependencies..."
cd backend
pip install -r requirements.txt --quiet
cd ..

echo "==> Installing frontend dependencies..."
cd frontend
npm install --silent
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "Run the stack:"
echo "  Terminal 1 → cd backend && uvicorn main:app --reload"
echo "  Terminal 2 → cd frontend && npm run dev"
echo "  Frontend   → http://localhost:5173"
echo "  API docs   → http://localhost:8000/docs"
