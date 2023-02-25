from flask import Flask, flash, redirect, render_template, request, session

def summary():
    return render_template("summary.html")