from flask import Flask, flash, redirect, render_template, request, session

def logout():
    # TODO
    session.clear()
    return redirect("/")
