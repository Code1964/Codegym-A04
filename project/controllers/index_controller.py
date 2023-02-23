from flask import Flask, flash, redirect, render_template, request, session

def index():
    return render_template("index.html")