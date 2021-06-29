/*********************************************
 * OPL 12.9.0.0 Model
 * Author: Melanie Reuter-Oppermann 
 * Creation Date: 22.06.2020 at 07:04:37
 *********************************************/

 int n=...; // number of volunteers
 int m=...; // number of defis
 range I = 1..n; // set of volunteers
 range L = 1..m; // set of defis
 
 int T=...; //arrival time of RTW
 int cpr=...; // volunteer CPR endurance time 
 int r=...; // volunteer rest time
 
 int dist[I]=...; //travel time of volunteers to the scene (in sec)
 int distAED[I][L]=...; //travel time of volunteers to scene with picking up an AED
 
 int M=...; //Big-M (large number)
 
 float w1=...; //weight Obj1
 float w2=...; //weight Obj2
 float w3=...; //weight Obj3
 
 dvar boolean x[I]; //if volunteer i is assigned to the emergency
 dvar boolean y[I][L]; // if volunteer i picks up AED l on the way to the emergency
 
 dvar int+ t; //time until first arrival of a volunteer
 dvar int+ s; //time until CPR starts
 
 dvar int+ a[I]; //arrival time of volunteer i at the scene
 dvar boolean v[I]; //if volunteer i arrives first at the scene
 dvar boolean w[I]; //if volunteer i arrives last at the scene
 dvar boolean z[I][I]; //if volunteer j arrives directly after i at the scene
 
 dvar int+ q1; //arrival gap; the possible gap in CPR/defibrillation between first volunteer on the scene and the following one
 dvar int+ q2; //CPR gap; the possible gap when the rest time (r) is greater than endurance time (cpr)
 
 dexpr int Obj1 = q1 + q2; //min time until treatment start
 dexpr int Obj2 = sum(i in I)(x[i]+sum(l in L)y[i][l]); //min number of dispatched volunteers
 dexpr float Obj3 = -1.3614+0.3429*t+0.18633*s; //max survival probability
 
 minimize w1*Obj1+w2*Obj2+w3*Obj3; //multi-criteria problem - min weighted sum approach
 
 subject to{
 
 	forall(i in I) a[i]== dist[i]*x[i] + sum(l in L) distAED[i][l]*y[i][l];
 	forall(i in I) x[i]+ sum(l in L) y[i][l] <= 1;
 	sum(i in I) sum(l in L) y[i][l] <= 1;
 	forall(i in I) dist[i]*x[i]+sum(l in L)distAED[i][l]*y[i][l] <= T;
 	forall(i in I) v[i] <= x[i]+sum(l in L)y[i][l];
 	sum(i in I) v[i] <= 1;
 	forall(i in I) w[i] <= x[i] + sum(l in L)y[i][l];
 	forall(i in I) w[i] <= 1;
 	forall(i in I) t >= a[i]-M*(1-v[i]);
 	t >= T*(1-sum(i in I)v[i]);
 	forall(i in I) s >= sum(l in L)distAED[i][l]*y[i][l];
 	s >= T*(1-sum(i in I)sum(l in L)y[i][l]);
 	forall(j in I) sum(i in I)z[i][j] <= 1;
 	forall(i in I) sum(j in I)z[i][j] <= x[i]+sum(l in L)y[i][l];
 	forall(i,j in I) z[i][j]+z[j][i] <= 1;
 	forall(i in I)z[i][i]==0;
 	forall(i,j in I)a[i] <= a[j]+M*(1-z[i][j]);
 	forall(i in I) n*(w[i]+1+sum(j in I)z[i][j]) >= x[i]+sum(l in L)y[i][l]+sum(j in I)x[j]+sum(j in I:j!=i)sum(l in L)y[j][l];
 	forall(j in I) w[j] <= v[j] + sum(i in I)z[i][j];
	forall(i,j in I) q1 >= a[j]-a[i]-cpr-M*(2-v[i]-z[i][j]);
	q2 >= r-cpr-T*(sum(i in I)(x[i]+sum(l in L)y[i][l])-2);
 }  
 
 