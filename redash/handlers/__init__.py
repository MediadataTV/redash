from flask import jsonify, request, Response, stream_with_context
from flask_login import login_required

from redash.handlers.api import api
from redash.handlers.base import routes
from redash.monitor import get_status
from redash.permissions import require_super_admin
from redash.security import talisman

import requests


@routes.route("/ping", methods=["GET"])
@talisman(force_https=False)
def ping():
    return "PONG."


@routes.route("/status.json")
@login_required
@require_super_admin
def status_api():
    status = get_status()
    return jsonify(status)


@routes.route("/proxy", methods=["GET"])
@login_required
def proxy():
    url = request.args.get('url', default=None)
    req = requests.get(url)
    return Response(req.content, content_type=req.headers['content-type'])


def init_app(app):
    from redash.handlers import (
        embed,
        queries,
        static,
        authentication,
        admin,
        setup,
        organization,
    )

    app.register_blueprint(routes)
    api.init_app(app)
