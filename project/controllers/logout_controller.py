from flask import Flask, flash, redirect, render_template, request, session

def logout():
    session.clear()
    return redirect("/")
