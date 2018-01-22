// planet_model.js
// Mark Fitzpatrick
// January 2018


// This function computes the test date value corresponding to the given
// year, month, and day.  Where year is a 4 digit number, month is between
// 1 and 12, and day is a valid day for the specified month. This value 
// corresponding to the start of the data at 0:00 UT.
function compute_test_date(year, month, day)
{
    answer = Math.floor(367 * year - (7 * (year +
         Math.floor ((month+9)/12)))/4 + Math.floor((275 * month)/9) +
         day - 730530);
    console.log(answer);
    return (answer);

}


// Given m, e in degrees
// Math.sin, Math.cos require radians input so multiply by Math.PI / 180.0
function compute_e0(m, e) 
{
    e0 = m + (180.0 / Math.PI) * e * Math.sin(m * Math.PI / 180.0) * 
         (1 + e * Math.cos(m * Math.PI / 180.0));

    return e0;
}


// Given m, e in degrees
// Math.sin, Math.cos require radians input so multiply by Math.PI / 180.0
function compute_e1(m, e, e0)
{
    e1 = e0 - (e0 - (180.0 / Math.PI) * e * 
         Math.sin(e0 * Math.PI / 180.0) - m) /
         (1 - e * Math.cos(e0 * Math.PI / 180.0) );

    return e1;
}


function compute_E(m, e)
{
    e0 = compute_e0(m, e);
    e1 = compute_e1(m, e, e0);
    // console.log ("First approximaation is with e0, e1 = " + e0 + ", " + e1);

    while (Math.abs(e1 - e0)  > 0.005)
    { 
        e0 = e1;
        e1 = compute_e1(m, e, e0);
        // console.log ("e0, e1 " + e0 + ", " + e1);
    }

    // E is e1
    return e1; 
}


// xeclip = r * ( cos(N) * cos(v+w) - sin(N) * sin(v+w) * cos(i) )
function compute_xeclip (r, n, v, w, i)
{
    xeclip = r * ( Math.cos(n * Math.PI / 180.0) * 
             Math.cos((v + w) * Math.PI / 180.0) - 
             Math.sin(n * Math.PI / 180.0) * 
             Math.sin((v + w) * Math.PI / 180.0)  * 
             Math.cos(i * Math.PI / 180.0) );

    return (xeclip);

}


// yeclip = r * ( sin(N) * cos(v+w) + cos(N) * sin(v+w) * cos(i) )
function compute_yeclip(r, n, v, w, i)
{

    yeclip = r * ( Math.sin(n * Math.PI / 180.0) * 
             Math.cos((v + w) * Math.PI / 180.0) + 
             Math.cos(n * Math.PI / 180.0) *
             Math.sin((v + w) * Math.PI / 180.0) *
             Math.cos(i * Math.PI / 180.0) );

    return (yeclip);
}


// zeclip = r * sin(v+w) * sin(i)
function compute_zeclip(r, v, w, i)
{
    zeclip = r * Math.sin((v + w) * Math.PI / 180.0) *
                 Math.sin(i * Math.PI / 180.0);

    return (zeclip);
}


// normalize x degrees to be between 0 and < 360
function rev(x)
{

  let rev = x - Math.floor(x / 360.0) * 360.0;

  if (rev < 0.0) {

    rev += 360.0
  }

  // console.log ("rev("+x+") is " + rev);

  return (rev);
}



// For each planet, we define the following parameters:
// 
//   N   Longitude of Ascending node
//   i   Inclination
//   w   Argument of perihelion
//   a   Semi-major axis
//   e   Eccentricity
//   M   Mean anonaly
// 
// The input for each planet includes
//
//  test_date - the date value computed by function 
//              compute_test_date for a given year, month and day.
//
//  sun_view_radius - the view radius of the sun as defined in planets.html
//  
//  planet_view_radius - the view radius of the planet the function is modeling
//



// mercury_model
//
// This function computes the ecliptic rectangular (x, y, z) 
// coordinates for Mercury for the specified test_date.
//
function mercury_model(test_date, sun_view_radius, mercury_view_radius) {

    // Long of asc. node
    mercury_N = rev(48.3313 + 3.24587E-5 * test_date);

    // Inclination
    mercury_i = rev( 7.0047 + 5.00E-8 * test_date);

    // Argument of perihelion
    mercury_w = rev(29.1241 + 1.01444E-5 * test_date);

    // semi-major axis 
    mercury_a = 0.387098;

    // Eccentricity 
    mercury_e = rev(0.205635 + 5.59E-10 * test_date);

    // Mean anomaly
    mercury_M = rev(168.6562 + 4.0923344368 * test_date); 

    // Dump the 6 parameters
    // =====================
    // console.log("Mercury");
    // console.log("N deg: " + mercury_N);
    // console.log("i deg: " + mercury_i);
    // console.log("w deg: " + mercury_w);
    // console.log("a a.e: " + mercury_a);
    // console.log("e    : " + mercury_e);
    // console.log("M deg: " + mercury_M);


    // compute E, the eccentric anomaly
    // use the iteration formula to obtain an accurate value of E
    E = compute_E(mercury_M, mercury_e);
    // console.log ("E = " + E);

    // compute x,y coordinates in the plane of the orbit...
    x = mercury_a * (Math.cos(E * Math.PI / 180.0) - mercury_e);
    y = mercury_a * (Math.sqrt(1 - (mercury_e * mercury_e))) * 
        Math.sin(E * Math.PI / 180.0);


    // compute r
    r = Math.sqrt((x * x) + (y * y));
    r += sun_view_radius;
    r += mercury_view_radius;

    // compute v
    v = Math.atan2(y, x) * 180 / Math.PI;
    v = rev(Math.atan2(y, x) * 180 / Math.PI);


    // compute the position in ecliptic coordinates

    xeclip = compute_xeclip(r, mercury_N, v, mercury_w, mercury_i);
    yeclip = compute_yeclip(r, mercury_N, v, mercury_w, mercury_i);
    zeclip = compute_zeclip(r, v, mercury_w, mercury_i);



    // compute Heliocentric longitude, latitude and distance
    longitude = rev (Math.atan2(yeclip, xeclip) * 180 / Math.PI);

    latitude = (Math.atan2(zeclip, Math.sqrt((xeclip * xeclip) +
        (yeclip * yeclip))) * 180 / Math.PI);

    distance = Math.sqrt( (xeclip * xeclip) + (yeclip * yeclip) +
                          (zeclip * zeclip));


    // console.log ("x = " + x);
    // console.log ("y = " + y);
    // console.log ("r = " + r);
    // console.log ("v = " + v);
    // console.log ("xeclip = " + xeclip);
    // console.log ("yeclip = " + yeclip);
    // console.log ("zeclip = " + zeclip);
    // console.log ("longitude = " + longitude);
    // console.log ("latitude  = " + latitude);
    // console.log ("distance  = " + distance);

    // check
    // console.log("Mercury: (" + xeclip + ", " + yeclip + ", " + zeclip + ")");
    return [xeclip, yeclip, zeclip];

}


// venus_model
//
// This function computes the ecliptic rectangular (x, y, z) 
// coordinates for Mercury for the specified test_date.
//
function venus_model(test_date, sun_view_radius, venus_view_radius) {

    // Long of asc. node
    venus_N = rev(76.6799 + 2.46590E-5 * test_date);

    // Inclination
    venus_i = rev( 3.3946 + 2.75E-8 * test_date);

    // Argument of perihelion
    venus_w = rev(54.8910 + 1.38374E-5 * test_date);

    // semi-major axis 
    venus_a = 0.723330;

    // Eccentricity 
    venus_e = rev(0.006773 - 1.302E-9 * test_date);

    // Mean anomaly
    venus_M = rev(48.0052 +  1.6021302244 * test_date); 

    // Dump the 6 parameters
    // =====================
    // console.log("Venus");
    // console.log("N deg: " + venus_N);
    // console.log("i deg: " + venus_i);
    // console.log("w deg: " + venus_w);
    // console.log("a a.e: " + venus_a);
    // console.log("e    : " + venus_e);
    // console.log("M deg: " + venus_M);

    // compute E, the eccentric anomaly
    // use the iteration formula to obtain an accurate value of E
    E = compute_E(venus_M, venus_e);
    // console.log ("E = " + E);

    // compute x,y coordinates in the plane of the orbit...
    x = venus_a * (Math.cos(E * Math.PI / 180.0) - venus_e);
    y = venus_a * (Math.sqrt(1 - (venus_e * venus_e))) * 
        Math.sin(E * Math.PI / 180.0);


    // compute r
    r = Math.sqrt((x * x) + (y * y));
    r += sun_view_radius;
    r += venus_view_radius;

    // compute v
    v = Math.atan2(y, x) * 180 / Math.PI;
    v = rev(Math.atan2(y, x) * 180 / Math.PI);


    // compute the position in ecliptic coordinates

    xeclip = compute_xeclip(r, venus_N, v, venus_w, venus_i);
    yeclip = compute_yeclip(r, venus_N, v, venus_w, venus_i);
    zeclip = compute_zeclip(r, v, venus_w, venus_i);

    
    // compute Heliocentric longitude, latitude and distance
    longitude = rev (Math.atan2(yeclip, xeclip) * 180 / Math.PI);

    latitude = (Math.atan2(zeclip, Math.sqrt((xeclip * xeclip) +
        (yeclip * yeclip))) * 180 / Math.PI);

    distance = Math.sqrt( (xeclip * xeclip) + (yeclip * yeclip) +
                          (zeclip * zeclip));


    // console.log ("x = " + x);
    // console.log ("y = " + y);
    // console.log ("r = " + r);
    // console.log ("v = " + v);
    // console.log ("xeclip = " + xeclip);
    // console.log ("yeclip = " + yeclip);
    // console.log ("zeclip = " + zeclip);
    // console.log ("longitude = " + longitude);
    // console.log ("latitude  = " + latitude);
    // console.log ("distance  = " + distance);

    // check
    // console.log("Venus: (" + xeclip + ", " + yeclip + ", " + zeclip + ")");
    return [xeclip, yeclip, zeclip];

}


function earth_model(test_date, sun_view_radius, earth_view_radius) {

    // Long of asc. node
    earth_N   = rev(-11.26064 + 2.32174E-5 * test_date);
    // earth_N   = rev(-11.26064);

//  mercury_N = rev(48.3313   + 3.24587E-5 * test_date);
//  venus_N   = rev(76.6799   + 2.46590E-5 * test_date);
//  mars_N    = rev(49.5574   + 2.11081E-5 * test_date);
//  jupiter_N = rev(100.4542  + 2.76854E-5 * test_date);
//  saturn_N  = rev(113.6634  + 2.38980E-5 * test_date);
//  uranus_N  = rev(74.0005   + 1.3978E-5  * test_date);
//  neptune_N = rev(131.7806  + 3.0173E-5  * test_date);



    // Inclination
    // the tilt of the orbit relative to the ecliptic. 
    // Varies from 0 to 180 degrees
    earth_i = rev( 0.00005 + 2.24E-8 * test_date);
    // earth_i = rev( 0.00005 );

//  mercury_i = rev( 7.0047   + 5.00E-8   * test_date);
//  venus_i   = rev( 3.3946   + 2.75E-8   * test_date);
//  mars_i    = rev( 1.8497   - 1.78E-8   * test_date);
//  jupiter_i = rev( 1.3030   - 1.5557E-7 * test_date);
//  saturn_i  = rev( 2.4886   - 1.081E-7  * test_date);
//  uranus_i  = rev( 0.7733   + 1.9E-8    * test_date);
//  neptune_i = rev( 1.7700   - 2.55E-7   * test_date);



    // Argument of perihelion
    earth_w = rev(102.94719 + 1.62654E-5 * test_date);
    // earth_w = rev(102.94719 );

//  mercury_w  = rev( 29.1241  + 1.01444E-5 * test_date);
//  venus_w    = rev( 54.8910  + 1.38374E-5 * test_date);
//  mars_w     = rev(286.5016  + 2.92961E-5 * test_date);
//  jupiter_w  = rev(273.87777 + 1.64505E-5 * test_date);
//  saturn_w   = rev(339.3939  + 2.97661E-5 * test_date);
//  uranus_w   = rev( 96.6612  + 3.0565E-5  * test_date);
//  neptune_w  = rev(272.8461  - 6.027E-6   * test_date);

    // semi-major axis in AU
    earth_a = 1.00000011;

    // Eccentricity,  0 < earth_e < 1
    earth_e = rev(0.01671022 + 1.462E-9 * test_date);
    // earth_e = rev(0.01671022);


//  mercury_e = rev(0.205635 + 5.59E-10 * test_date);
//  venus_e   = rev(0.006773 - 1.302E-9 * test_date);
//  mars_e    = rev(0.093405 + 2.516E-9 * test_date);
//  jupiter_e = rev(0.048498 + 4.469E-9 * test_date);
//  saturn_e = rev(0.055546 - 9.499E-9 * test_date);
//  uranus_e  = rev(0.047318 + 7.45E-9 * test_date);
//  neptune_e = rev(0.008606 + 2.15E-9 * test_date);

 

    // Mean anomaly
    // Mean distance or semi-major axis
    earth_M = rev(100.46435  +  1.0139217 * test_date);
    // earth_M = rev(100.46435);

//  mercury_M = rev(168.6562 +  4.0923344368 * test_date); 
//  venus_M   = rev( 48.0052 +  1.6021302244 * test_date); 
//  mars_M    = rev( 18.6021 +  0.5240207766 * test_date); 
//  jupiter_M = rev( 19.8950 +  0.0830853001 * test_date); 
//  saturn_M  = rev(316.9670 +  0.0334442282 * test_date); 
//  uranus_M  = rev(142.5905 +  0.011725806  * test_date); 
//  neptune_M = rev(260.2471 +  0.005995147  * test_date); 

    // T Time at perihelion
    // q Perihelion distance = a * (1 - e)
    // Note: it is customary to give q instead of a for the case in which
    //       an elliptical orbits with eccentricity close to one.


    // Dump the 6 parameters
    // =====================
    // console.log("Earth");
    // console.log("N deg: " + earth_N);
    // console.log("i deg: " + earth_i);
    // console.log("w deg: " + earth_w);
    // console.log("a a.e: " + earth_a);
    // console.log("e    : " + earth_e);
    // console.log("M deg: " + earth_M);

    // compute E, the eccentric anomaly
    // use the iteration formula to obtain an accurate value of E
    E = compute_E(earth_M, earth_e);
    console.log ("E = " + E);

    // compute x,y coordinates in the plane of the orbit...
    x = earth_a * (Math.cos(E * Math.PI / 180.0) - earth_e);
    y = earth_a * (Math.sqrt(1 - (earth_e * earth_e))) * 
        Math.sin(E * Math.PI / 180.0);


    // compute r
    r = Math.sqrt((x * x) + (y * y));
    r += sun_view_radius;
    r += earth_view_radius;

    // compute v
    v = Math.atan2(y, x) * 180 / Math.PI;
    v = rev(Math.atan2(y, x) * 180 / Math.PI);


    // compute the position in ecliptic coordinates

    xeclip = compute_xeclip(r, earth_N, v, earth_w, earth_i);
    yeclip = compute_yeclip(r, earth_N, v, earth_w, earth_i);
    zeclip = compute_zeclip(r, v, earth_w, earth_i);

    
    // compute Heliocentric longitude, latitude and distance
    longitude = rev (Math.atan2(yeclip, xeclip) * 180 / Math.PI);

    latitude = (Math.atan2(zeclip, Math.sqrt((xeclip * xeclip) +
        (yeclip * yeclip))) * 180 / Math.PI);

    distance = Math.sqrt( (xeclip * xeclip) + (yeclip * yeclip) +
                          (zeclip * zeclip));


    // console.log ("x = " + x);
    // console.log ("y = " + y);
    // console.log ("r = " + r);
    // console.log ("v = " + v);
    // console.log ("xeclip = " + xeclip);
    // console.log ("yeclip = " + yeclip);
    // console.log ("zeclip = " + zeclip);
    // console.log ("longitude = " + longitude);
    // console.log ("latitude  = " + latitude);
    // console.log ("distance  = " + distance);

    // check
    console.log("Earth: (" + xeclip + ", " + yeclip + ", " + zeclip + ")");
    return [xeclip, yeclip, zeclip];

}


// mars_model
//
// This function computes the ecliptic rectangular (x, y, z) 
// coordinates for Mars for the specified test_date.
//
function mars_model(test_date, sun_view_radius, mars_view_radius) {

    // Long of asc. node
    mars_N = rev(49.5574 + 2.11081E-5 * test_date);

    // Inclination
    mars_i = rev( 1.8497 - 1.78E-8 * test_date);

    // Argument of perihelion
    mars_w = rev(286.5016 + 2.92961E-5 * test_date);

    // semi-major axis 
    mars_a = 1.523688;

    // Eccentricity 
    mars_e = rev(0.093405 + 2.516E-9 * test_date);

    // Mean anomaly
    mars_M = rev(18.6021 +  0.5240207766 * test_date); 

    // Dump the 6 parameters
    // =====================
    // console.log("Mars");
    // console.log("N deg: " + mars_N);
    // console.log("i deg: " + mars_i);
    // console.log("w deg: " + mars_w);
    // console.log("a a.e: " + mars_a);
    // console.log("e    : " + mars_e);
    // console.log("M deg: " + mars_M);

    // compute E, the eccentric anomaly
    // use the iteration formula to obtain an accurate value of E
    E = compute_E(mars_M, mars_e);
    // console.log ("E = " + E);

    // compute x,y coordinates in the plane of the orbit...
    x = mars_a * (Math.cos(E * Math.PI / 180.0) - mars_e);
    y = mars_a * (Math.sqrt(1 - (mars_e * mars_e))) * 
        Math.sin(E * Math.PI / 180.0);


    // compute r
    r = Math.sqrt((x * x) + (y * y));
    r += sun_view_radius;
    r += mars_view_radius;

    // compute v
    v = Math.atan2(y, x) * 180 / Math.PI;
    v = rev(Math.atan2(y, x) * 180 / Math.PI);


    // compute the position in ecliptic coordinates

    xeclip = compute_xeclip(r, mars_N, v, mars_w, mars_i);
    yeclip = compute_yeclip(r, mars_N, v, mars_w, mars_i);
    zeclip = compute_zeclip(r, v, mars_w, mars_i);

    
    // compute Heliocentric longitude, latitude and distance
    longitude = rev (Math.atan2(yeclip, xeclip) * 180 / Math.PI);

    latitude = (Math.atan2(zeclip, Math.sqrt((xeclip * xeclip) +
        (yeclip * yeclip))) * 180 / Math.PI);

    distance = Math.sqrt( (xeclip * xeclip) + (yeclip * yeclip) +
                          (zeclip * zeclip));


    // console.log ("x = " + x);
    // console.log ("y = " + y);
    // console.log ("r = " + r);
    // console.log ("v = " + v);
    // console.log ("xeclip = " + xeclip);
    // console.log ("yeclip = " + yeclip);
    // console.log ("zeclip = " + zeclip);
    // console.log ("longitude = " + longitude);
    // console.log ("latitude  = " + latitude);
    // console.log ("distance  = " + distance);

    // check
    // console.log("Mars: (" + xeclip + ", " + yeclip + ", " + zeclip + ")");
    return [xeclip, yeclip, zeclip];

}

// jupiter_model
//
// This function computes the ecliptic rectangular (x, y, z) 
// coordinates for Jupiter for the specified test_date.
//
function jupiter_model(test_date, sun_view_radius, jupiter_view_radius) {

    // Long of asc. node
    jupiter_N = rev(100.4542 + 2.76854E-5 * test_date);

    // Inclination
    jupiter_i = rev( 1.3030 - 1.5557E-7 * test_date);

    // Argument of perihelion
    jupiter_w = rev(273.87777 + 1.64505E-5 * test_date);

    // semi-major axis 
    jupiter_a = 5.20256;

    // Eccentricity 
    jupiter_e = rev(0.048498 + 4.469E-9 * test_date);

    // Mean anomaly
    jupiter_M = rev(19.8950 +  0.0830853001 * test_date); 

    // Dump the 6 parameters
    // =====================
    // console.log("Jupiter");
    // console.log("N deg: " + jupiter_N);
    // console.log("i deg: " + jupiter_i);
    // console.log("w deg: " + jupiter_w);
    // console.log("a a.e: " + jupiter_a);
    // console.log("e    : " + jupiter_e);
    // console.log("M deg: " + jupiter_M);


    // compute E, the eccentric anomaly
    // use the iteration formula to obtain an accurate value of E
    E = compute_E(jupiter_M, jupiter_e);
    // console.log ("E = " + E);

    // compute x,y coordinates in the plane of the orbit...
    x = jupiter_a * (Math.cos(E * Math.PI / 180.0) - jupiter_e);
    y = jupiter_a * (Math.sqrt(1 - (jupiter_e * jupiter_e))) * 
        Math.sin(E * Math.PI / 180.0);


    // compute r
    r = Math.sqrt((x * x) + (y * y));
    r += sun_view_radius;
    r += jupiter_view_radius;

    // compute v
    v = Math.atan2(y, x) * 180 / Math.PI;
    v = rev(Math.atan2(y, x) * 180 / Math.PI);


    // compute the position in ecliptic coordinates

    xeclip = compute_xeclip(r, jupiter_N, v, jupiter_w, jupiter_i);
    yeclip = compute_yeclip(r, jupiter_N, v, jupiter_w, jupiter_i);
    zeclip = compute_zeclip(r, v, jupiter_w, jupiter_i);

    
    // compute Heliocentric longitude, latitude and distance
    longitude = rev (Math.atan2(yeclip, xeclip) * 180 / Math.PI);

    latitude = (Math.atan2(zeclip, Math.sqrt((xeclip * xeclip) +
        (yeclip * yeclip))) * 180 / Math.PI);

    distance = Math.sqrt( (xeclip * xeclip) + (yeclip * yeclip) +
                          (zeclip * zeclip));


    // console.log ("x = " + x);
    // console.log ("y = " + y);
    // console.log ("r = " + r);
    // console.log ("v = " + v);
    // console.log ("xeclip = " + xeclip);
    // console.log ("yeclip = " + yeclip);
    // console.log ("zeclip = " + zeclip);
    // console.log ("longitude = " + longitude);
    // console.log ("latitude  = " + latitude);
    // console.log ("distance  = " + distance);

    // check
    // console.log("Jupiter: (" + xeclip + ", " + yeclip + ", " + zeclip + ")");
    return [xeclip, yeclip, zeclip];

}

// saturn_model
//
// This function computes the ecliptic rectangular (x, y, z) 
// coordinates for Saturn for the specified test_date.
//
function saturn_model(test_date, sun_view_radius, saturn_view_radius) {

    // Long of asc. node
    saturn_N = rev(113.6634 + 2.38980E-5 * test_date);

    // Inclination
    saturn_i = rev( 2.4886 - 1.081E-7 * test_date);

    // Argument of perihelion
    saturn_w = rev(339.3939 + 2.97661E-5 * test_date);

    // semi-major axis 
    saturn_a = 9.55475;

    // Eccentricity 
    saturn_e = rev(0.055546 - 9.499E-9 * test_date);

    // Mean anomaly
    saturn_M = rev(316.9670 +  0.0334442282 * test_date); 

    // Dump the 6 parameters
    // =====================
    // console.log("Saturn");
    // console.log("N deg: " + saturn_N);
    // console.log("i deg: " + saturn_i);
    // console.log("w deg: " + saturn_w);
    // console.log("a a.e: " + saturn_a);
    // console.log("e    : " + saturn_e);
    // console.log("M deg: " + saturn_M);

    // compute E, the eccentric anomaly
    // use the iteration formula to obtain an accurate value of E
    E = compute_E(saturn_M, saturn_e);
    // console.log ("E = " + E);

    // compute x,y coordinates in the plane of the orbit...
    x = saturn_a * (Math.cos(E * Math.PI / 180.0) - saturn_e);
    y = saturn_a * (Math.sqrt(1 - (saturn_e * saturn_e))) * 
        Math.sin(E * Math.PI / 180.0);


    // compute r
    r = Math.sqrt((x * x) + (y * y));
    r += sun_view_radius;
    r += saturn_view_radius;

    // compute v
    v = Math.atan2(y, x) * 180 / Math.PI;
    v = rev(Math.atan2(y, x) * 180 / Math.PI);


    // compute the position in ecliptic coordinates

    xeclip = compute_xeclip(r, saturn_N, v, saturn_w, saturn_i);
    yeclip = compute_yeclip(r, saturn_N, v, saturn_w, saturn_i);
    zeclip = compute_zeclip(r, v, saturn_w, saturn_i);

    
    // compute Heliocentric longitude, latitude and distance
    longitude = rev (Math.atan2(yeclip, xeclip) * 180 / Math.PI);

    latitude = (Math.atan2(zeclip, Math.sqrt((xeclip * xeclip) +
        (yeclip * yeclip))) * 180 / Math.PI);

    distance = Math.sqrt( (xeclip * xeclip) + (yeclip * yeclip) +
                          (zeclip * zeclip));


    // console.log ("x = " + x);
    // console.log ("y = " + y);
    // console.log ("r = " + r);
    // console.log ("v = " + v);
    // console.log ("xeclip = " + xeclip);
    // console.log ("yeclip = " + yeclip);
    // console.log ("zeclip = " + zeclip);
    // console.log ("longitude = " + longitude);
    // console.log ("latitude  = " + latitude);
    // console.log ("distance  = " + distance);

    // check
    // console.log("Saturn: (" + xeclip + ", " + yeclip + ", " + zeclip + ")");
    return [xeclip, yeclip, zeclip];

}

// uranus_model
//
// This function computes the ecliptic rectangular (x, y, z) 
// coordinates for Uranus for the specified test_date.
//
function uranus_model(test_date, sun_view_radius, uranus_view_radius) {

    // Long of asc. node
    uranus_N = rev(74.0005 + 1.3978E-5 * test_date);

    // Inclination
    uranus_i = rev( 0.7733 + 1.9E-8 * test_date);

    // Argument of perihelion
    uranus_w = rev(96.6612 + 3.0565E-5 * test_date);

    // semi-major axis 
    uranus_a = rev(19.18171 - 1.55E-8 * test_date);

    // Eccentricity 
    uranus_e = rev(0.047318 + 7.45E-9 * test_date);

    // Mean anomaly
    uranus_M = rev(142.5905 +  0.011725806 * test_date); 

    // Dump the 6 parameters
    // =====================
    // console.log("Uranus");
    // console.log("N deg: " + uranus_N);
    // console.log("i deg: " + uranus_i);
    // console.log("w deg: " + uranus_w);
    // console.log("a a.e: " + uranus_a);
    // console.log("e    : " + uranus_e);
    // console.log("M deg: " + uranus_M);


    // compute E, the eccentric anomaly
    // use the iteration formula to obtain an accurate value of E
    E = compute_E(uranus_M, uranus_e);
    // console.log ("E = " + E);

    // compute x,y coordinates in the plane of the orbit...
    x = uranus_a * (Math.cos(E * Math.PI / 180.0) - uranus_e);
    y = uranus_a * (Math.sqrt(1 - (uranus_e * uranus_e))) * 
        Math.sin(E * Math.PI / 180.0);


    // compute r
    r = Math.sqrt((x * x) + (y * y));
    r += sun_view_radius;
    r += uranus_view_radius;

    // compute v
    v = Math.atan2(y, x) * 180 / Math.PI;
    v = rev(Math.atan2(y, x) * 180 / Math.PI);


    // compute the position in ecliptic coordinates

    xeclip = compute_xeclip(r, uranus_N, v, uranus_w, uranus_i);
    yeclip = compute_yeclip(r, uranus_N, v, uranus_w, uranus_i);
    zeclip = compute_zeclip(r, v, uranus_w, uranus_i);

    
    // compute Heliocentric longitude, latitude and distance
    longitude = rev (Math.atan2(yeclip, xeclip) * 180 / Math.PI);

    latitude = (Math.atan2(zeclip, Math.sqrt((xeclip * xeclip) +
        (yeclip * yeclip))) * 180 / Math.PI);

    distance = Math.sqrt( (xeclip * xeclip) + (yeclip * yeclip) +
                          (zeclip * zeclip));


    // console.log ("x = " + x);
    // console.log ("y = " + y);
    // console.log ("r = " + r);
    // console.log ("v = " + v);
    // console.log ("xeclip = " + xeclip);
    // console.log ("yeclip = " + yeclip);
    // console.log ("zeclip = " + zeclip);
    // console.log ("longitude = " + longitude);
    // console.log ("latitude  = " + latitude);
    // console.log ("distance  = " + distance);

    // check
    // console.log("Uranus: (" + xeclip + ", " + yeclip + ", " + zeclip + ")");
    return [xeclip, yeclip, zeclip];

}

// neptune_model
//
// This function computes the ecliptic rectangular (x, y, z) 
// coordinates for Neptune for the specified test_date.
//
function neptune_model(test_date, sun_view_radius, neptune_view_radius) {

    // Long of asc. node
    neptune_N = rev(131.7806 + 3.0173E-5 * test_date);

    // Inclination
    neptune_i = rev( 1.7700 - 2.55E-7 * test_date);

    // Argument of perihelion
    neptune_w = rev(272.8461 - 6.027E-6 * test_date);

    // semi-major axis 
    neptune_a = rev(30.05826 + 3.313E-8 * test_date);

    // Eccentricity 
    neptune_e = rev(0.008606 + 2.15E-9 * test_date);

    // Mean anomaly
    neptune_M = rev(260.2471 + 0.005995147 * test_date); 

    // Dump the 6 parameters
    // =====================
    // console.log("Neptune");
    // console.log("N deg: " + neptune_N);
    // console.log("i deg: " + neptune_i);
    // console.log("w deg: " + neptune_w);
    // console.log("a a.e: " + neptune_a);
    // console.log("e    : " + neptune_e);
    // console.log("M deg: " + neptune_M);


    // compute E, the eccentric anomaly
    // use the iteration formula to obtain an accurate value of E
    E = compute_E(neptune_M, neptune_e);
    // console.log ("E = " + E);

    // compute x,y coordinates in the plane of the orbit...
    x = neptune_a * (Math.cos(E * Math.PI / 180.0) - neptune_e);
    y = neptune_a * (Math.sqrt(1 - (neptune_e * neptune_e))) * 
        Math.sin(E * Math.PI / 180.0);


    // compute r
    r = Math.sqrt((x * x) + (y * y));
    r += sun_view_radius;
    r += neptune_view_radius;

    // compute v
    v = Math.atan2(y, x) * 180 / Math.PI;
    v = rev(Math.atan2(y, x) * 180 / Math.PI);


    // compute the position in ecliptic coordinates

    xeclip = compute_xeclip(r, neptune_N, v, neptune_w, neptune_i);
    yeclip = compute_yeclip(r, neptune_N, v, neptune_w, neptune_i);
    zeclip = compute_zeclip(r, v, neptune_w, neptune_i);

    
    // compute Heliocentric longitude, latitude and distance
    longitude = rev (Math.atan2(yeclip, xeclip) * 180 / Math.PI);

    latitude = (Math.atan2(zeclip, Math.sqrt((xeclip * xeclip) +
        (yeclip * yeclip))) * 180 / Math.PI);

    distance = Math.sqrt( (xeclip * xeclip) + (yeclip * yeclip) +
                          (zeclip * zeclip));


    // console.log ("x = " + x);
    // console.log ("y = " + y);
    // console.log ("r = " + r);
    // console.log ("v = " + v);
    // console.log ("xeclip = " + xeclip);
    // console.log ("yeclip = " + yeclip);
    // console.log ("zeclip = " + zeclip);
    // console.log ("longitude = " + longitude);
    // console.log ("latitude  = " + latitude);
    // console.log ("distance  = " + distance);

    // check
    // console.log("Neptune: (" + xeclip + ", " + yeclip + ", " + zeclip + ")");
    return [xeclip, yeclip, zeclip];

}


// using test date -3543, which is 19 april 1990
function test()
{
    results = mercury_model(-3543);
    console.log (results[0]);
    console.log (results[1]);
    console.log (results[2]);

    console.log ("========================================================");
    results = venus_model(-3543);
    console.log (results[0]);
    console.log (results[1]);
    console.log (results[2]);

    console.log ("========================================================");
    results = mars_model(-3543);
    console.log (results[0]);
    console.log (results[1]);
    console.log (results[2]);

    console.log ("========================================================");
    results = jupiter_model(-3543);
    console.log (results[0]);
    console.log (results[1]);
    console.log (results[2]);

    console.log ("========================================================");
    results = saturn_model(-3543);
    console.log (results[0]);
    console.log (results[1]);
    console.log (results[2]);

    console.log ("========================================================");
    results = uranus_model(-3543);
    console.log (results[0]);
    console.log (results[1]);
    console.log (results[2]);

    console.log ("========================================================");
    results = neptune_model(-3543);
    console.log (results[0]);
    console.log (results[1]);
    console.log (results[2]);
    console.log ("========================================================");

}

