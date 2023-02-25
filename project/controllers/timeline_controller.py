from flask import Flask, flash, redirect, render_template, request, session

def timeline():
    return render_template("timeline.html")