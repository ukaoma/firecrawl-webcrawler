FasdUAS 1.101.10   ��   ��    k             l     ��  ��    $  FirecrawlLauncher.applescript     � 	 	 <   F i r e c r a w l L a u n c h e r . a p p l e s c r i p t   
  
 l     ��  ��    I C Script to launch the Firecrawl webcrawler and open it in a browser     �   �   S c r i p t   t o   l a u n c h   t h e   F i r e c r a w l   w e b c r a w l e r   a n d   o p e n   i t   i n   a   b r o w s e r      l     ��������  ��  ��        l     ��  ��    I C Path to the project directory (update this with the absolute path)     �   �   P a t h   t o   t h e   p r o j e c t   d i r e c t o r y   ( u p d a t e   t h i s   w i t h   t h e   a b s o l u t e   p a t h )      j     �� �� 0 projectpath projectPath  m        �   f / U s e r s / u k a o m a / D o c u m e n t s / G i t H u b / f i r e c r a w l - w e b c r a w l e r      l     ��������  ��  ��        i         I     ������
�� .aevtoappnull  �   � ****��  ��     k     � ! !  " # " O      $ % $ k     & &  ' ( ' l   �� ) *��   ) !  Open a new terminal window    * � + + 6   O p e n   a   n e w   t e r m i n a l   w i n d o w (  , - , I   �� .��
�� .coredoscnull��� ��� ctxt . b     / 0 / b     1 2 1 m     3 3 � 4 4  c d   2 n     5 6 5 1   
 ��
�� 
strq 6 o    
���� 0 projectpath projectPath 0 m     7 7 � 8 8 $   & &   n o d e   s e r v e r . j s��   -  9 : 9 l   �� ; <��   ; 3 - Set the window title for easy identification    < � = = Z   S e t   t h e   w i n d o w   t i t l e   f o r   e a s y   i d e n t i f i c a t i o n :  >�� > r     ? @ ? m     A A � B B   F i r e c r a w l   S e r v e r @ n       C D C 1    ��
�� 
titl D 4   �� E
�� 
cwin E m    ���� ��   % m      F F�                                                                                      @ alis    J  Macintosh HD               �
�BD ����Terminal.app                                                   �����
�        ����  
 cu             	Utilities   -/:System:Applications:Utilities:Terminal.app/     T e r m i n a l . a p p    M a c i n t o s h   H D  *System/Applications/Utilities/Terminal.app  / ��   #  G H G l   ��������  ��  ��   H  I J I l   �� K L��   K , & Wait a moment for the server to start    L � M M L   W a i t   a   m o m e n t   f o r   t h e   s e r v e r   t o   s t a r t J  N O N I   #�� P��
�� .sysodelanull��� ��� nmbr P m    ���� ��   O  Q R Q l  $ $��������  ��  ��   R  S T S l  $ $�� U V��   U * $ Open the browser to the application    V � W W H   O p e n   t h e   b r o w s e r   t o   t h e   a p p l i c a t i o n T  X Y X I  $ )�� Z��
�� .GURLGURLnull��� ��� TEXT Z m   $ % [ [ � \ \ * h t t p : / / l o c a l h o s t : 3 0 0 0��   Y  ] ^ ] l  * *��������  ��  ��   ^  _ ` _ l  * *�� a b��   a %  Bring the browser to the front    b � c c >   B r i n g   t h e   b r o w s e r   t o   t h e   f r o n t `  d e d Q   * w f g h f O   - : i j i r   1 9 k l k m   1 2��
�� boovtrue l n       m n m 1   6 8��
�� 
pisf n 4   2 6�� o
�� 
prcs o m   4 5 p p � q q  S a f a r i j m   - . r r�                                                                                  sevs  alis    \  Macintosh HD               �
�BD ����System Events.app                                              �����
�        ����  
 cu             CoreServices  0/:System:Library:CoreServices:System Events.app/  $  S y s t e m   E v e n t s . a p p    M a c i n t o s h   H D  -System/Library/CoreServices/System Events.app   / ��   g R      ������
�� .ascrerr ****      � ****��  ��   h Q   B w s t u s O   E T v w v r   I S x y x m   I J��
�� boovtrue y n       z { z 1   P R��
�� 
pisf { 4   J P�� |
�� 
prcs | m   L O } } � ~ ~  G o o g l e   C h r o m e w m   E F  �                                                                                  sevs  alis    \  Macintosh HD               �
�BD ����System Events.app                                              �����
�        ����  
 cu             CoreServices  0/:System:Library:CoreServices:System Events.app/  $  S y s t e m   E v e n t s . a p p    M a c i n t o s h   H D  -System/Library/CoreServices/System Events.app   / ��   t R      ������
�� .ascrerr ****      � ****��  ��   u Q   \ w � ��� � O   _ n � � � r   c m � � � m   c d��
�� boovtrue � n       � � � 1   j l��
�� 
pisf � 4   d j�� �
�� 
prcs � m   f i � � � � �  F i r e f o x � m   _ ` � ��                                                                                  sevs  alis    \  Macintosh HD               �
�BD ����System Events.app                                              �����
�        ����  
 cu             CoreServices  0/:System:Library:CoreServices:System Events.app/  $  S y s t e m   E v e n t s . a p p    M a c i n t o s h   H D  -System/Library/CoreServices/System Events.app   / ��   � R      ������
�� .ascrerr ****      � ****��  ��  ��   e  � � � l  x x��������  ��  ��   �  � � � l  x x�� � ���   �   Notify the user    � � � �     N o t i f y   t h e   u s e r �  ��� � I  x ��� � �
�� .sysonotfnull��� ��� TEXT � m   x { � � � � � x F i r e c r a w l   w e b c r a w l e r   i s   n o w   r u n n i n g   a t   h t t p : / / l o c a l h o s t : 3 0 0 0 � �� ���
�� 
appr � m   ~ � � � � � � $ F i r e c r a w l   L a u n c h e r��  ��     � � � l     ��������  ��  ��   �  � � � i    
 � � � I     ������
�� .aevtquitnull��� ��� null��  ��   � k     { � �  � � � I    �� � �
�� .sysodlogaskr        TEXT � m      � � � � � X W o u l d   y o u   l i k e   t o   s t o p   t h e   F i r e c r a w l   s e r v e r ? � �� � �
�� 
btns � J     � �  � � � m     � � � � �  K e e p   R u n n i n g �  ��� � m     � � � � �  S t o p   S e r v e r��   � �� ���
�� 
dflt � m     � � � � �  K e e p   R u n n i n g��   �  � � � Z    s � ����� � =    � � � n     � � � 1    ��
�� 
bhit � 1    ��
�� 
rslt � m     � � � � �  S t o p   S e r v e r � O    o � � � k    n � �  � � � l   �� � ���   � 2 , Find the terminal window running the server    � � � � X   F i n d   t h e   t e r m i n a l   w i n d o w   r u n n i n g   t h e   s e r v e r �  ��� � X    n ��� � � Z   + i � ����� � =  + 4 � � � n   + 0 � � � 1   , 0��
�� 
titl � o   + ,���� 0 w   � m   0 3 � � � � �   F i r e c r a w l   S e r v e r � k   7 e � �  � � � l  7 7�� � ���   � %  Send Ctrl+C to stop the server    � � � � >   S e n d   C t r l + C   t o   s t o p   t h e   s e r v e r �  � � � r   7 E � � � 4   7 ?�� �
�� 
tprf � m   ; > � � � � � 
 B a s i c � n       � � � 1   @ D��
�� 
tcst � o   ? @���� 0 w   �  � � � I  F Q�� � �
�� .coredoscnull��� ��� ctxt � m   F I � � � � � � o s a s c r i p t   - e   ' t e l l   a p p l i c a t i o n   " S y s t e m   E v e n t s "   t o   k e y s t r o k e   " c "   u s i n g   c o n t r o l   d o w n ' � �� ���
�� 
kfil � o   L M���� 0 w  ��   �  � � � I  R W�� ���
�� .sysodelanull��� ��� nmbr � m   R S���� ��   �  � � � I  X c�� � �
�� .coredoscnull��� ��� ctxt � m   X [ � � � � �  e x i t � �� ���
�� 
kfil � o   ^ _���� 0 w  ��   �  ��� �  S   d e��  ��  ��  �� 0 w   � 2   ��
�� 
cwin��   � m     � ��                                                                                      @ alis    J  Macintosh HD               �
�BD ����Terminal.app                                                   �����
�        ����  
 cu             	Utilities   -/:System:Applications:Utilities:Terminal.app/     T e r m i n a l . a p p    M a c i n t o s h   H D  *System/Applications/Utilities/Terminal.app  / ��  ��  ��   �  ��� � M   t { � � I     ������
�� .aevtquitnull��� ��� null��  ��  ��   �  ��� � l     ��������  ��  ��  ��       �� �  � ���   � �������� 0 projectpath projectPath
�� .aevtoappnull  �   � ****
�� .aevtquitnull��� ��� null � ��  ���� � ���
�� .aevtoappnull  �   � ****��  ��   �   �  F 3�� 7�� A������ [� r�~ p�}�|�{ } � ��z ��y
�� 
strq
�� .coredoscnull��� ��� ctxt
�� 
cwin
�� 
titl
�� .sysodelanull��� ��� nmbr
� .GURLGURLnull��� ��� TEXT
�~ 
prcs
�} 
pisf�|  �{  
�z 
appr
�y .sysonotfnull��� ��� TEXT�� �� �b   �,%�%j O�*�k/�,FUOlj O�j 
O � 
e*��/�,FUW <X   � e*�a /�,FUW "X   � e*�a /�,FUW X  hOa a a l  � �x ��w�v � ��u
�x .aevtquitnull��� ��� null�w  �v   � �t�t 0 w   �  ��s � ��r ��q�p�o�n � ��m�l�k�j�i ��h ��g ��f�e�d ��c
�s 
btns
�r 
dflt�q 
�p .sysodlogaskr        TEXT
�o 
rslt
�n 
bhit
�m 
cwin
�l 
kocl
�k 
cobj
�j .corecnte****       ****
�i 
titl
�h 
tprf
�g 
tcst
�f 
kfil
�e .coredoscnull��� ��� ctxt
�d .sysodelanull��� ��� nmbr
�c .aevtquitnull��� ��� null�u |����lv��� O��,�  _� W T*�-[��l kh  �a ,a   3*a a /�a ,FOa a �l Okj Oa a �l OY h[OY��UY hO)jd*  ascr  ��ޭ