from flask import Flask, flash, redirect, render_template, request, session

def event():
    return render_template("event.html") ##wiki_image=page_data.images[0]