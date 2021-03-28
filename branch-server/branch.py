from flask import Flask, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
db = SQLAlchemy(app)

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)

    def __repr__(self):
        return f'<Name {id}>'

@app.route('/')
def home():
    return 'Hello World'

@app.route('/users', methods=['POST', 'GET'])
def users():
    if request.method == 'POST':
        name = request.form['name']
        new_user = Users(name=name)
        try:
            db.session.add(new_user)
            db.session.commit()
            return redirect('/users')
        except:
            return 'A problem occured when adding the user.'
    users = Users.query.order_by(Users.id)
    return render_template('users.html', users=users)

if __name__ == '__main__':
    app.run(debug=True)