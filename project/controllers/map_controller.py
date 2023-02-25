from flask import Flask, flash, redirect, render_template, request, session

def map():
    return render_template("map.html")