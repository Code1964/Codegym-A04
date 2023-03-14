from flask import Flask, flash, redirect, render_template, request, session

def usage():
    return render_template('usage.html')