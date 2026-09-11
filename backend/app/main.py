from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.matching import router as matching_router
from app.api.routes.auth import router as auth_router
from app.api.routes.users import router as users_router
from app.api.routes.profiles import router as profiles_router
from app.api.routes.opportunities import router as opportunities_router
from app.core.config import settings
from app.api.routes.matching import router as matching_router
from app.api.routes.recommendations import router as recommendations_router
from app.api.routes.saved_opportunities import router as saved_opportunities_router
from app.api.routes.applications import router as applications_router
from app.api.routes.eligibility_rules import router as eligibility_rules_router



app = FastAPI(
    title=settings.APP_NAME,
    description="Backend API for the Aptora opportunity discovery platform.",
    version=settings.APP_VERSION,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(applications_router)
app.include_router(matching_router)
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(profiles_router)
app.include_router(opportunities_router)
app.include_router(matching_router)
app.include_router(recommendations_router)
app.include_router(saved_opportunities_router)
app.include_router(eligibility_rules_router)



@app.get("/")
def root():
    return {
        "message": "Welcome to Aptora API",
        "status": "running",
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "aptora-backend",
    }