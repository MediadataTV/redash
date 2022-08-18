import click
import simplejson
from flask import current_app
from flask.cli import FlaskGroup, run_command, with_appcontext
from rq import Connection

from redash import __version__, create_app, settings, rq_redis_connection
from redash.cli import data_sources, database, groups, organization, queries, users, rq
from redash.monitor import get_status


def create(group):
    app = current_app or create_app()
    group.app = app

    @app.shell_context_processor
    def shell_context():
        from redash import models, settings

        return {"models": models, "settings": settings}

    return app


@click.group(cls=FlaskGroup, create_app=create)
def manager():
    """Management script for Redash"""


manager.add_command(database.manager, "database")
manager.add_command(users.manager, "users")
manager.add_command(groups.manager, "groups")
manager.add_command(data_sources.manager, "ds")
manager.add_command(organization.manager, "org")
manager.add_command(queries.manager, "queries")
manager.add_command(rq.manager, "rq")
manager.add_command(run_command, "runserver")


@manager.command()
def test():
    """Test data."""
    from redash import models
    import requests
    from redash.utils import json_dumps, base_url
    org = models.Organization.get_by_id(1)
    alert = models.Alert.get_by_id_and_org(4, org)
    host = base_url(alert.query_rel.org)
    query = alert.query_rel
    # print(alert.custom_body)

    url = 'https://chat.googleapis.com/v1/spaces/AAAARjM2NVs/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=nST7hqwIdDzNqS_vy6My8GVsG5-66rkkzY7eA-PdiiY%3D'
    try:
        message = '<b><font color="#c0392b">Triggered</font></b>'

        if alert.custom_subject:
            title = alert.custom_subject
        else:
            title = alert.name

        data = {
            "cards": [
                {
                    "header": {"title": title},
                    "sections": [
                        {"widgets": [{"textParagraph": {"text": message}}]}
                    ],
                }
            ]
        }

        if alert.custom_body:
            data["cards"][0]["sections"].append(
                {"widgets": [{"textParagraph": {"text": alert.custom_body_skiptables}}]}
            )

        # Hangouts Chat will create a blank card if an invalid URL (no hostname) is posted.
        if host:
            data["cards"][0]["sections"][0]["widgets"].append(
                {
                    "buttons": [
                        {
                            "textButton": {
                                "text": "OPEN QUERY",
                                "onClick": {
                                    "openLink": {
                                        "url": "{host}/queries/{query_id}".format(
                                            host=host, query_id=query.id
                                        )
                                    }
                                },
                            }
                        }
                    ]
                }
            )

        headers = {"Content-Type": "application/json; charset=UTF-8"}
        resp = requests.post(
            url, data=json_dumps(data), headers=headers, timeout=5.0
        )
        print(data)
        # if resp.status_code != 200:
        #     print(
        #         "webhook send ERROR. status_code => {status}".format(
        #             status=resp.status_code
        #         )
        #     )
    except Exception as e:
        print(e)
        print("webhook send ERROR.")


@manager.command()
def version():
    """Displays Redash version."""
    print(__version__)


@manager.command()
def status():
    with Connection(rq_redis_connection):
        print(simplejson.dumps(get_status(), indent=2))


@manager.command()
def check_settings():
    """Show the settings as Redash sees them (useful for debugging)."""
    for name, item in current_app.config.items():
        print("{} = {}".format(name, item))


@manager.command()
@click.argument("email", default=settings.MAIL_DEFAULT_SENDER, required=False)
def send_test_mail(email=None):
    """
    Send test message to EMAIL (default: the address you defined in MAIL_DEFAULT_SENDER)
    """
    from redash import mail
    from flask_mail import Message

    if email is None:
        email = settings.MAIL_DEFAULT_SENDER

    mail.send(
        Message(
            subject="Test Message from Redash", recipients=[email], body="Test message."
        )
    )


@manager.command("shell")
@with_appcontext
def shell():
    import sys
    from ptpython import repl
    from flask.globals import _app_ctx_stack

    app = _app_ctx_stack.top.app

    repl.embed(globals=app.make_shell_context())
