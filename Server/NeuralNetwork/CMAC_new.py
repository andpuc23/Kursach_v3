import matplotlib
from oct2py import octave
from oct2py import Oct2Py
import numpy as np

oc = Oct2Py()

string = """
classdef CMAC
    % класс для нейронной сети CMAC
    %
    % net=CMAC(r,mu);
    %
    % ЌейроннаЯ сеть обладает свойствами:
    % r                      параметр "ро"
    % памЯть нейронной сети представляется в виде гиперпараллелепипеда
    % со сторонами r mu(1) mu(2) ... mu(N)
    % mu                    строка
    % xmax                  строка определяющая максимальные значения координат которые
    %                       может запомнить нейронная сеть
    % W                     собственно память нейронной сети
    % MemorySize            размер памяти
    % trainParam            струкутра дополнительных параметров для обучения
    % trainParam.epochs     количество эпох обучения
    % trainParam.tol        заданная точность
    % Далее под L понимается количество примеров, под N размерность входов.
    
    %% свойства
    properties
        trainParam=struct('epochs',1,'tol',1e-6,'start',1);
    end
    properties (SetAccess=private)
        r=4;
        mu=[3 3];
        xmax=[9 9];
        W=zeros(4,3,3);
        MemorySize=3*3*4;
    end
    %% методы
    methods
        
        function net=CMAC(r,x)
            % создание сети
            % задаются r и x макмисальные значения координат
            % расчитываются остальные параметры
            % память обнуляется
            if nargin>1
                net.r=r;
                mu1=fix((x-1+r-1)/r)+1;
                net.mu=mu1(:);
                net.xmax=r*(mu1(:)-1)+1;
                c=[r mu1];
                net.MemorySize=prod(c);
                net.W=zeros(c);
            end
        end
        
        function [z]=sim(net,P)
            % z=sim(net,P)
            % расчет выхода нейронной сети по заданному входу
            % (просто сумма активных ячеек памяти)
            % работает с множеством многомерных входов
            % первая координата - размерность входа
            % вторая координата - количество примеров
            c=active(net,P);
            z=sum(net.W(c),1);
        end
        
        function c=active(net,P)
            % c=active(net,P)
            % Расчет номеров активных ячеек памяти для заданных входов
            % возвращает номера активных
            % ячеек памяти при линейном представлении
            c1=fix((P-1)/net.r); %основные координаты активных ячеек
            m=mod(P-1,net.r); %дополнительные координаты
            c=zeros(net.r,size(P,2));
            mucp=net.r*cumprod(net.mu(end:-1:2))';
            mucp=[1 mucp];
            mucp=mucp(end:-1:1);
            for i=1:net.r
                c2=c1+((i-1)<m);
                %c2=c1+1-((i-1)<(net.r-m));
                %c2=c1+((i-1)>=(net.r-m));
                c3=mucp*c2+1;
                c(i,:)=c3+(i-1)*net.mu(end);                             
            end
        end
        
        function net1=train(net,P,T)
            % net1=train(net,P,T)
            % Обучение неронной сети
            % P         обучающие входы (N,L)
            % T         обучающий выход (1,L)

            net1=net;
            w=net.W;          
            for j=1:net.trainParam.epochs
                for i=1:size(P,2)
                    c=active(net,P(:,i));
                    e=T(:,i)-sum(w(c),1);
                    w(c)=w(c)+e/net.r;
                end
                if mod(j,100)==0, fprintf(1,'%d\n',j), end;
            end
            net1.W=w;
        end   
    end   
end
"""

oc.eval(string)