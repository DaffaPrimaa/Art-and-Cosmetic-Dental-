"""merge branch histories

Revision ID: 2ad87515f76c
Revises: 55b294ad43a9, d767956b044b
Create Date: 2025-11-10 13:11:18.937312

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2ad87515f76c'
down_revision: Union[str, Sequence[str], None] = ('55b294ad43a9', 'd767956b044b')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
