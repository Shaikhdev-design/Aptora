from fastapi import Depends, HTTPException, status

from app.auth.dependencies import get_current_active_user
from app.models.user import User


def require_role(*allowed_roles: str):
    """
    Dependency factory for restricting a route to specific user roles.

    Usage:
        @router.get("/admin/stuff", dependencies=[Depends(require_role("ADMIN"))])
    """

    def _check_role(
        current_user: User = Depends(get_current_active_user),
    ) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action.",
            )
        return current_user

    return _check_role


require_admin = require_role("ADMIN")
