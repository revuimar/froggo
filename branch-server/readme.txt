
to install flask:
    pip install flask

to init database:
    pip install flask-sqlalchemy
    (navigate to project folder)
    python
    >>> from branch import db
    >>> db.create_all()
    >>> exit()

to get pylint to recognize SQLAlchemy fields and methods in vscode:
    pip install pylint-flask-sqlalchemy
    (create .vscode folder in project folder)
    (create settings.json in .vscode and copy and paste the json below:)
    {
        # You have to put it in this order to make it works
        "python.linting.pylintArgs": [
            "--load-plugins",
            "pylint_flask_sqlalchemy",
            "pylint_flask",                 # This package is optional
        ]
    }