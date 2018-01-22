README.md
=========

Solar System Feat of Strength 

My implementation of the Solar System is in 3D and runs in a Google Chrome 
web browser.  I developed the code on my MacBook Pro, but it also works
on MicroSoft Windows and various flavors of Unix provided a current version of
the Google Chrome web browser is installed.  In particular, I was using Google
Chrome Version 63.0.3239.132 (Official Build) (64-bit) on my Mac.


The planets look good on my 23.5 inch (1920 x 1080) monitor.

The source is organized as follows:

/FoS-master contains this README.md file and two subdirectories:
 FoS and libs.

/FoS-master/FoS contains planet_model.js and planets.html

/FoS-master/libs contains the necessary libs for working with
WebGL and three.js



To start, copy the FoS directory and its content to a convenient
place on your computer, such as the Desktop.

Start your Chrome Browser, and open the file planets.html from the
/FoS-master/FoS directory.



Design Features
===============

I modeled the planets orbits around the sun using elliptical orbits.
The file planet_model.js contains the model code.  The view and controller
code is defined in planets.html.  The controls include a slider on the
top right hand side of the screen for specifying the speed of the orbits,
and a reverse checkbox, which causes the planets to revolve backwards in
time when checked.

You should notice that each planet is drawn to scale and using good colors.  
However, the size of the Sun compared to the planets is inaccurate but
necessary in order not to waste too much screen real estate for the Sun alone.

Distances are to scale, based on astronimical units.

I was able to verify my computations by comparing output against examples from
Computing planetary positions - a tutorial with worked examples using the 
reference date of -3543, which is 19 April 1990.



References
==========


The following links provided useful information that I read while working on 
the FoS.

https://nssdc.gsfc.nasa.gov/planetary/factsheet/
https://nssdc.gsfc.nasa.gov/planetary/factsheet/mercuryfact.html
https://nssdc.gsfc.nasa.gov/planetary/factsheet/venusfact.html
https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html
https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html
https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html
https://nssdc.gsfc.nasa.gov/planetary/factsheet/saturnfact.html
https://nssdc.gsfc.nasa.gov/planetary/factsheet/uranusfact.html
https://nssdc.gsfc.nasa.gov/planetary/factsheet/neptunefact.html
https://nssdc.gsfc.nasa.gov/planetary/factsheet/neptunefact.html


Computing planetary positions - a tutorial with worked examples
By Paul Schlyter, Stockholm, Sweden
http://www.stjarnhimlen.se/comp/tutorial.html




Learning Three.js: The JavaSCript 3D Library for WebGL
by Jos Dirksen
Published by Packt Publishing, 2013

WebGL Programming Guide
Interactive 3D Graphics Programming with WebGL
Kouichi Matsuda
Rodger Lea

