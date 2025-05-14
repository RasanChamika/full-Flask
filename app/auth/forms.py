from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, BooleanField, EmailField
from wtforms.validators import DataRequired, Email, Length, EqualTo, Regexp

class RegisterForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=8, message="User must be at least 6 characters")])
    email = EmailField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=8), Regexp(r'(?=.*[A-Z])(?=.*\d)(?=.*\W)', message="Password must be contain uppercase, number, and special character.")])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password', message="Password must match!")])
    terms = BooleanField('I agree to the tems and conditions', validators=[DataRequired()])
    submit = SubmitField('Register', validators=[DataRequired(), ])


class LoginForm(FlaskForm):
    email = EmailField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=8), Regexp(r'(?=.*[A-Z])(?=.*\d)(?=.*\W)', message="Password must be contain uppercase, number, and special character.")])
    confirm_password = PasswordField('Confirm Password')
    remember = BooleanField('Remember Me')
    submit = SubmitField('Login')