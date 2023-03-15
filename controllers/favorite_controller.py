from flask import Flask, flash, redirect, render_template, request, session, url_for

def favorite():
    # とりあえずget
    region_name = request.args.get("region_name")
    placeID = request.args.get('placeID') # ない場合もある
    print(region_name)
    print(placeID)
    print("========================================")

    return redirect(url_for('flashcard'))
